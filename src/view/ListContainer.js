/**
 * TODO: Move fancy paging stuff to PagingListContainer.js
 * 
 */
var ListContainer = Component.extend({
	
	name:"ListContainer",
	//debugEnabled:true,
	
	dataProvider:null,//instance of ArrayCollection
	_items:null,//list of our renderers
	rendererClass:ItemRenderer,//reference to the renderer used for all items.
	_containerClass:"frodo-listcontainer",
	containerClass: "frodo-listcontainer",
	_contentClass:"frodo-listcontainer-list",
	_backgroundClass:"frodo-listcontainer",
	autoScroll:false,
	showEmpty:false,
	loadingTemplate:"<div>This list is empty.</div>",//we're using our loadingTemplate as our 'empty' display where needed.
	contentTemplate : "<ul></ul>",
	pendingCount:0,
	_dataLength:0,
	_redrawing:false,
	
	//Events
	ITEM_SELECTED:"frodo.ui.listContainer.itemSelected",
	ITEM_ADDED:"frodo.ui.listContainer.itemAdded",
	ITEM_REMOVED:"frodo.ui.listContainer.itemRemoved",
	ITEM_VIEWED:"frodo.ui.listContainer.itemViewed",
	PENDING_COUNT_CHANGE:"frodo.ui.listContainer.pendingCountChange",
	LIST_SCROLLING:"frodo.ui.listContainer.listScrolling",
	RESIZE:"frodo.ui.listContainer.resize",
	
	init:function(cfg, dp, itemRenderer, showEmpty) {
		if (dp !== null && dp !== undefined ) { // TODO type check for Arraycollection
			this.dataProvider = dp;
		} else if ( this.dataProvider === null ) {
			this.dataProvider = new ArrayCollection();
		}
		if(this.dataProvider instanceof ArrayCollection) {
			this.dataProvider.addEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
		}
		this._dataLength = this.dataProvider.getLength();
		if ( itemRenderer !== null && typeof itemRenderer !== "undefined" ) {
			this.rendererClass = itemRenderer;
		}
		
		if(showEmpty !== null && typeof showEmpty !== "undefined") {
			this.showEmpty = showEmpty;
		}

		this._items = [];
		this._redrawing = false;
		this._super(cfg);
		
	},
	
	draw:function() {
		this._super();
		this.$bgView.addClass(this._backgroundClass);
		this.$contentView.addClass(this._contentClass);
		this.setSize(this.height, this.width);
	},
	
	bindEvents:function() {
		//this._super();
		$(window).bind("resize", $.proxy(this.onResize, this));
		this.redraw();
	},

	drawPagingControls: function () {
		
		if(this.pagingPrevLabel != null && this.pagingPrevLabel.length > 0) {
			this.$contentView.append("<div class='frodo-listcontainer-prev frodo-listcontainer-pagingcontrol'>"+this.pagingPrevLabel+"</div>");
			this.pagingPrevButton = this.$view.find(".frodo-listcontainer-prev");
			new ClickHandler(this, this.pagingPrevButton, this._onPagePrev );
		}
		
		if(this.pagingNextLabel != null && this.pagingNextLabel.length > 0) {
			this.$contentView.append("<div class='frodo-listcontainer-next frodo-listcontainer-pagingcontrol'>"+this.pagingNextLabel+"</div>");
			this.pagingNextButton = this.$view.find(".frodo-listcontainer-next");
			new ClickHandler(this, this.pagingNextButton, this._onPageNext );
		}
		
		// calculate max pages
		this.pagingMaxPages = Math.ceil(this.dataProvider.getLength() / this.pagingItemsPer);
		
		this.updatePageButtonVisibility();		
	},
	
	focusPage: function () {
	    if ( this.type == this.TYPE_PAGING ) {
    		// TODO: this is being done for a single item right now, we need to go back and make it work for 
    		// sets so we can animate the entire thing as a single container.
    		var selection = this.getPagingRange();
    		// hide everything first
    		this.hideAll();
    		for ( var i = selection.start ; i < selection.end ; i++ ) {
    			// looping over the selection items and displaying them
    			this.getItemAt(i).show();
    		}
		}
	},
	
	_onPagePrev: function () {

		// decrement the selected page
		this.pagingSelectedPage = Math.max(1, this.pagingSelectedPage-1);
		this.focusPage();
		
		this.updatePageButtonVisibility();				
	},
	
	_onPageNext: function () {
		
		// incrament the selected page
		this.pagingSelectedPage = Math.min(this.pagingMaxPages, this.pagingSelectedPage+1);
		this.focusPage();
		
		this.updatePageButtonVisibility();				
	},
	
	updatePageButtonVisibility: function() {
	
		if( this.pagingPrevButton != null ) {
			if ( this.pagingSelectedPage > 1 ) {
				this.pagingPrevButton.show();
			} else {
				this.pagingPrevButton.hide();
			}
		}
		
		if( this.pagingNextButton != null ) {
			if ( this.pagingSelectedPage < this.pagingMaxPages ) {
				this.pagingNextButton.show();
			} else {
				this.pagingNextButton.hide();
			}			
		}
	},

	getPagingRange: function () {
		var endRange = this.pagingSelectedPage * this.pagingItemsPer;
		var startRange = endRange - this.pagingItemsPer;
		return { start: startRange, end: endRange };
	},
	
	hideAll: function() {
		for ( var i = 0 ; i < this._items.length ; i++ ) {
			// looping over the selection items and displaying them
			this.getItemAt(i).hide();
		}
	},
	
	setAutoScroll:function(s) {
		this.autoScroll = s;
	},

	//redraws everything from our dataProvider
	//TODO: appendItem takes a renderer but
	// we are not accounting for it here.
	redraw:function() {
		
		if( (this._items.length === this.dataProvider.getLength()) && this._items.length > 0) {
			this.debug("length is the same.. recycle??", "dp: "+this.dataProvider.getLength(), "items: "+this._items.length);
			this._recycle();
			return;
		}
		this.removeAll();
		this._items = [];
		if(this.showEmpty && this.dataProvider.getLength() == 0) {
			this.setLoading(true);
		} else {
			this.setLoading(false);
			
			//append one item and listen for it to finish. once finished, remove listener
			// and append the next item if necessary.
			//if(!this._redrawing) {
				if(this.dataProvider.getLength() > 0) {
					this._redrawing = true;
					this.debug("starting redraw. appending first item:", this.dataProvider.getItemAt(0));
					var item = this.appendItem(this.dataProvider.getItemAt(0));
					item.addEventListener(item.RENDERED, this._onItemRendered, this );
					
				}
			//} else {
			//	this.debug(this.name+" : redraw called while already redrawing. ignoring.");
			//}
		}
		this.setSize(this.height, this.width);
		if(this.autoScroll) {
			this.scrollToBottom();
		}
		this.updatePageButtonVisibility();//Moving!
	},
	
	_recycle:function() {
		this.debug("_recycle called:");
		for(var i=0; i<this._items.length; i++) {
			this._items[i].setData(this.dataProvider.getItemAt(i));
		}
		if(this.autoScroll) {
			this.scrollToBottom();
		}
	},
	
	_onItemRendered:function(event) {
		var item = event.context.item;
		item.removeEventListener(item.RENDERED, this._onItemRendered, this);
		var len = this.dataProvider.getLength();
		if(this._items.length < len) {
			var item = this.appendItem(this.dataProvider.getItemAt(this._items.length/*-1*/));
			item.addEventListener(item.RENDERED, this._onItemRendered, this );
		} else {
			this._redrawing = false;
		}
		if(this.autoScroll) {
			this.scrollToBottom();
		}
	},
	
	//TODO: index is un-used?
	appendItem:function( item, renderer, index) {
		this.debug("appending item", item);
		var itemWidget = null;
		
		if(renderer===null || renderer === undefined) {
			renderer = this.rendererClass;
			this.debug("Using default renderer:", this.rendererClass);
		}
			 
		try {
			itemWidget = new renderer(new ConfigVO("100%", "100%", this.contentID), item);
			itemWidget.addEventListener(itemWidget.ITEM_SELECTED, this.onItemSelected, this);
			itemWidget.addEventListener(itemWidget.REQUEST_REMOVE, this.onRequestRemove, this);
			this.addEventListener(this.RESIZE, itemWidget.onResize, itemWidget );
			this._items.push(itemWidget);
		} catch ( e ) { 
			this.error("Error appending item in ListContainer:", this, e, itemWidget);
		}
		
		
		if(this.autoScroll) {
			this.scrollToBottom();
		}
		if(itemWidget !== null) {
			return itemWidget;
		} else {
			return item;
		}
		
	},
	
	removeAll:function()  {
		if(this._items !== null) {
			for(var i=this._items.length -1; i>=0; i--) {
				this.removeItemAt(i);
			}
		}
		this._items = [];
		//
	},

	removeItemAt:function(index) {
		if(index !== undefined && this._items[index] !== undefined) {
			this._items[index].removeEventListener(this._items[index].ITEM_SELECTED, this.onItemSelected, this);
			this._items[index].removeEventListener(this._items[index].PENDING_COUNT_CHANGE, this.onPendingCountChange, this);
			this._items[index].removeEventListener(this._items[index].REQUEST_REMOVE, this.onRequestRemove, this);
			//TODO: remove resize listener.
			this.removeEventListener(this.RESIZE, this._items[index].onResize, this._items[index]);
			this.dispatchEvent(this.ITEM_REMOVED, {item:this._items[index]}, false);
			this.debug("ABOUT TO DESTROY AN ITEM!", this._items[index]);
			this._items[index].destroy();
			this._items.splice(index,1);
		}
		
	},
	
	getItemAt:function(index) {
		if(index !== undefined && this._items[index] !== undefined) {
			return this._items[index];
		}
		return null;
	},
	
	removeItem:function(item, index) {
		if(index === undefined || index === null) {
			for(var i=0; i<this._items.length; i++) {
				if(this._items[i] == item ){
					index = i;
					break;
				}
			}
		}
		if(index !== undefined && index !== null) {
			this.removeItemAt(index);
		}
	},
	
	updateItem:function(item, index) {
		this.debug("updating an item:", item, index);
		if(this._items[index] !== undefined) {
			this._items[index].setData(item);// = item; // update the data with the new version
		} else {
			this.error(this, "attempted to update an item but cannot find it! adding it.", this._items.slice(0), item, index);
		}
	},
	
	setDataProvider:function(ac) {
		this.debug(this,"LC setDataProvider called:", ac);
		if(ac !== undefined && ac !== null) { 

			if (this.dataProvider !== null && this.dataProvider !== undefined) {
				this.dataProvider.removeEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
			}
			this.dataProvider = ac;
			this.dataProvider.addEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
			this._dataLength = this.dataProvider.getLength();

			//this.debug("resetting the fn redraw flag.");
			this._redrawing = false;
			this.redraw();
		}
	},
	
	getDataProvider:function() {
		return this.dataProvider;
	},
	
	setSize:function(h, w) {
		this.$bgView.height(h);
		this.$bgView.width(w);
	},
	
	scrollToBottom:function() {
		this.$bgView.scrollTo("max");
	},
	
	/** Event Handlers **/
	_onDataChanged: function(event){
		if(this.showEmpty && this.dataProvider.getLength() == 0) {
			this.setLoading(true);
			return;
		} else {
			this.setLoading(false);
		}
		switch (event.context.type) {
			case this.dataProvider.ADD:
				this.onAdd(event.context.item, event.context.index);
				break;
			case this.dataProvider.REMOVE:
				this.onRemove(event.context.item, event.context.index);
				break;
			case this.dataProvider.UPDATE:
				this.onUpdate(event.context.item, event.context.index);
				break;
			case this.dataProvider.RESET:
				this.onReset();
				break;
			case this.dataProvider.SORTED:
				if(this._dataLength != this.dataProvider.getLength()) {
					this.onReset();
				} else {
					this.onSort();
				}
				break;
		}
		this._dataLength = this.dataProvider.getLength();
	},
	
	onItemSelected:function(event) {
		this.dispatchEvent(this.ITEM_SELECTED, event, false);
	},
	
	onRequestRemove:function(event) {
		var item = event.context.renderer;
		if(item !== null){
			this.removeItem(item);
		}
	},
	
	/** override in subclasses as necessary **/
	onAdd:function(item, index) {
		var renderClass = null;
		// if there is a renderClass property on the VO that isnt null we should use it to render
		if ( item.renderClass !== undefined && item.renderClass !== null ) {
			renderClass = item.renderClass;
		}
		this.appendItem(item, renderClass, index);
	},
	
	onRemove:function(item, index) {
		this.removeItem(item, index);
	},
	
	onUpdate:function(item, index) {
		if(item !== undefined && index !== undefined ) {
			this.updateItem(item, index);
		} 
	},
	
	onReset:function() {
		this.redraw();
	},
	
	onSort:function() {
		this._recycle();
	},

	onResize:function(event) {
		this.dispatchEvent(this.RESIZE, {container:this}, false);
	},
	
	destroy:function() {
		this.removeAll();
		this.dataProvider.removeEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
		$(window).unbind("resize", this.onResize);
		this._super();
	}
	
});