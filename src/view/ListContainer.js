
var ListContainer = Component.extend({
	
	name:"UPListContainer",
	//debugEnabled:true,
	
	dataProvider:null,//instance of ArrayCollection
	_items:null,//list of our renderers
	rendererClass:ItemRenderer,//reference to the renderer used for all items.
	_containerClass:"winston-listcontainer-widget",
	containerClass: "winston-listcontainer-widget",
	_contentClass:"winston-listcontainer-list",
	_backgroundClass:"winston-listcontainer",
	autoScroll:false,
	showEmpty:false,
	loadingTemplate:"<div>This list is empty.</div>",//we're using our loadingTemplate as our 'empty' display where needed.
	contentTemplate : "<ul></ul>",
	pendingCount:0,
	_dataLength:0,
	_redrawing:false,
	_drawingProcessor:null,//instance of Processor class
	
	type: "scroll",
	pagingItemsPer: 10,
	pagingNextLabel: null,
	pagingPrevLabel: null,
	pagingSelectedPage: 1,
	pagingPrevButton: null,
	pagingNextButton: null,
	pagingMaxPages: 0,
	
	TYPE_PAGING: "paging",
	TYPE_SCROLL: "scroll",
	
	//Events
	ITEM_SELECTED:"winston.ui.listContainer.itemSelected",
	ITEM_ADDED:"winston.ui.listContainer.itemAdded",
	ITEM_REMOVED:"winston.ui.listContainer.itemRemoved",
	ITEM_VIEWED:"winston.ui.listContainer.itemViewed",
	PENDING_COUNT_CHANGE:"winston.ui.listContainer.pendingCountChange",
	LIST_SCROLLING:"winston.ui.listContainer.listScrolling",
	
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

		if ( cfg.type !== undefined ) {
			this.type = cfg.type;
			if ( this.type == this.TYPE_PAGING ) {
				this.pagingItemsPer = cfg.pagingItemsPer;
				this.pagingPrevLabel = cfg.pagingPrevLabel;
				this.pagingNextLabel = cfg.pagingNextLabel;
			}	
		} 
		
		if(showEmpty !== null && typeof showEmpty !== "undefined") {
			this.showEmpty = showEmpty;
		}
		this.pendingCount = 0;
		this._items = [];
		this._redrawing = false;
		this._drawingProcessor = null;
		this._super(cfg);
		
	},
	
	draw:function() {
		this._super();
		this.$bgView.addClass(this._backgroundClass);
		this.$contentView.addClass(this._contentClass);
		this.setSize(this.height, this.width);
		
		if ( this.type == this.TYPE_PAGING ) {
			this.drawPagingControls();
		}
		
	},
	
	bindEvents:function() {
		//this._super();
		this.redraw();
	},

	drawPagingControls: function () {
		
		this.$contentView.append("<div class='winston-listcontainer-prev winston-listcontainer-pagingcontrol'>"+this.pagingPrevLabel+"</div>");
		this.pagingPrevButton = this.$view.find(".winston-listcontainer-prev");
		
		this.$contentView.append("<div class='winston-listcontainer-next winston-listcontainer-pagingcontrol'>"+this.pagingNextLabel+"</div>");
		this.pagingNextButton = this.$view.find(".winston-listcontainer-next");
		
		
		new ClickHandler(this, this.pagingPrevButton, this._onPagePrev );
		new ClickHandler(this, this.pagingNextButton, this._onPageNext );
		
		// calculate max pages
		this.pagingMaxPages = this.dataProvider.getLength() / this.pagingItemsPer;
		
		// if the page is 0 hide the prevLabel
		if ( this.pagingSelectedPage == 1 ) {
			this.pagingPrevButton.hide();
		}
		
	},
	
	focusPage: function () {
		// TODO: this is being done for a single item right now, we need to go back and make it work for 
		// sets so we can animate the entire thing as a single container.
		var selection = this.getPagingRange();
		// hide everything first
		this.hideAll();
		for ( var i = selection.start ; i < selection.end ; i++ ) {
			// looping over the selection items and displaying them
			this.getItemAt(i).show();
		}
	},
	
	_onPagePrev: function () {

		// decrement the selected page
		this.pagingSelectedPage = this.pagingSelectedPage-1;
		this.focusPage();
		
		// if we now have a need for a previous button?
		if ( this.pagingSelectedPage < this.pagingMaxPages ) {
			this.pagingNextButton.show();
		}
		
		// if we have no more pages to go forward...
		if ( this.pagingSelectedPage == 1 ) {
			this.pagingPrevButton.hide();
		}
		
	},
	
	_onPageNext: function () {
		
		// incrament the selected page
		this.pagingSelectedPage = this.pagingSelectedPage+1;
		this.focusPage();
		
		// if we now have a need for a previous button?
		if ( this.pagingSelectedPage > 0 ) {
			this.pagingPrevButton.show();
		}
		
		// if we have no more pages to go forward...
		if ( this.pagingSelectedPage == this.pagingMaxPages ) {
			this.pagingNextButton.hide();
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
			//this.debug("length is the same.. recycle??", "dp: "+this.dataProvider.getLength(), "items: "+this._items.length);
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
					//this.debug("starting redraw. appending first item:", this.dataProvider.getItemAt(0));
					//var item = this.appendItem(this.dataProvider.getItemAt(0));
					//item.addEventListener(item.RENDERED, this._onItemRendered, this );
					this.debug("starting a new process!",this._drawingProcessor);

					if(this._drawingProcessor !== null) {
						this.debug("stopping processor!");
						//this._drawingProcessor.stop();
					}
					this._drawingProcessor = new Processor(this.dataProvider.toArray(), this._processItem, this);
					this._drawingProcessor.addEventListener(this._drawingProcessor.COMPLETE, this._processComplete, this);
					this._drawingProcessor.run();
				}
			//} else {
			//	this.debug(this.name+" : redraw called while already redrawing. ignoring.");
			//}
		}
		this.setSize(this.height, this.width);
		
	},
	
	_processItem:function(item) {
		var renderClass = null;
		// if there is a renderClass property on the VO that isnt null we should use it to render
		if ( item.renderClass !== undefined && item.renderClass !== null ) {
			renderClass = item.renderClass;
		}
		this.appendItem(item,renderClass);
	},
	
	_recycleItem:function(item) {
		var index = this.dataProvider.indexOf(item);
		this._items[index].setData(item);
	},
	
	_processComplete:function(event) {
		this.debug(this, "processor complete:", event.context.processor, this._drawingProcessor);
		var p = event.context.processor;
		p.removeEventListener(p.COMPLETE, this._processComplete, this);
		p.destroy();
		this._drawingProcessor = p = null;
	},
	
	_recycle:function() {
		this.debug("_recycle called:");
		//loop through all item renderers (that are visible??) and reset their data appropriately?
		//invisible items will get updated as they become visible, as long as we can get their index??
		//var len = this.dataProvider.getLength();
		//User Processor for this
		if(this._drawingProcessor !== null) {
			this._drawingProcessor.stop();
		}
		this._drawingProcessor = new Processor(this.dataProvider.toArray(), this._recycleItem, this);
		this._drawingProcessor.addEventListener(this._drawingProcessor.COMPLETE, this._processComplete, this);
		this._drawingProcessor.run();
		/*
		for(var i=0; i<this._items.length; i++) {
			this._items[i].setData(this.dataProvider.getItemAt(i));
		}
		*/
	},
	
	//Deprecated?
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
	},
	
	//TODO: index is un-used?
	appendItem:function( item, renderer, index) {
		var itemWidget = null;
		
		if(renderer===null || renderer === undefined) {
			renderer = this.rendererClass;
			//this.debug("Using default renderer:", this.rendererClass);
		}
			 
		try {
			
			itemWidget = new renderer(new ConfigVO(this.contentID), item);
			itemWidget.addEventListener(itemWidget.ITEM_SELECTED, this.onItemSelected, this);
			itemWidget.addEventListener(itemWidget.REQUEST_REMOVE, this.onRequestRemove, this);
			this._items.push(itemWidget);
		} catch ( e ) { 
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
		//TODO: destroy our view first then restore?
		//this.draw();//hmm...
		for(var i=this._items.length -1; i>=0; i--) {
			this.removeItem(this._items[i], i);
		}
		
	},

	removeItemAt:function(index) {
		if(index !== undefined && this._items[index] !== undefined) {
			this._items[index].removeEventListener(this._items[index].ITEM_SELECTED, this.onItemSelected, this);
			this._items[index].removeEventListener(this._items[index].PENDING_COUNT_CHANGE, this.onPendingCountChange, this);
			this._items[index].removeEventListener(this._items[index].REQUEST_REMOVE, this.onRequestRemove, this);
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
		
		//this.debug("what is at the index currently?", this._items[index]);
		//try{
		if(this._items[index] !== undefined) {
			this._items[index].setData(item);// = item; // update the data with the new version
		} else {
			this.error(this, "attempted to update an item but cannot find it! adding it.", this._items[index], item, index);
			console.trace();
			//should we add it?//jr: this is why I'm seeing users stay in the roster list when they go offline...
			this.appendItem(item);
		}
		//this._items[index].bindData(); // binddata so the ui can respond
		//} catch(e) {
		//	this.error("error in updateItem", e, item, index);
		//}
	},
	
	setDataProvider:function(ac) {
		this.error(this,"LC setDataProvider called:", ac);
		if(ac !== undefined && ac !== null) { 
			//if (!this.getSDK().MSIE) {
				if (this.dataProvider !== null && this.dataProvider !== undefined) {
					this.dataProvider.removeEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
				}
			//}
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
		//JR: Suppress sorts that happen in rapid succession....
		//...
		//this.onReset();
		this._recycle();
		/*
		this.debug("SORTING AN LC");

		//loop through data provider
		// AND items and call setData() on each
		// item
		this.debug("SORTING A LISTCONTAINER");
		var len = this.dataProvider.getLength();
		for(var i=0; i<len; i++) {
			this.debug("setting data on item:", this._items[i], this.dataProvider.getItemAt(i));
			this._items[i].setData(this.dataProvider.getItemAt(i));
		}
		*/
	},

	destroy:function() {
		this.removeAll();
		this.dataProvider.removeEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
		this._super();
	}
	
});

ListContainer.prototype.TYPE_PAGING = "paging";
ListContainer.prototype.TYPE_SCROLL = "scroll";
