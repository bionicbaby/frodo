var PagingListContainer = ListContainer.extend({
	
	name:"PagingListContainer",
	debugEnabled:true,
	

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
	
	init:function(cfg, dp, itemRenderer, showEmpty) {
		this._super(cfg, dp, itemRenderer, showEmpty);
		if ( cfg.type !== undefined ) {
			this.type = cfg.type;
			if ( this.type == this.TYPE_PAGING ) {
				this.pagingItemsPer = cfg.pagingItemsPer;
				this.pagingPrevLabel = cfg.pagingPrevLabel;
				this.pagingNextLabel = cfg.pagingNextLabel;
			}	
		} 
	},
	
	draw:function() {
		this._super();
		this.drawPagingControls();
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
	
	redraw:function() {
		this._super();
		this.updatePageButtonVisibility();
	},
	
	setDataProvider:function(ac) {
		this._super(ac);
		// calculate max pages
		this.pagingMaxPages = Math.ceil(this.dataProvider.getLength() / this.pagingItemsPer);
	},
	
	/** Event Handlers **/
	_onDataChanged: function(event){
		this._super(event);
		// calculate max pages
		this.pagingMaxPages = Math.ceil(this.dataProvider.getLength() / this.pagingItemsPer);
		this.updatePageButtonVisibility();
		this.focusPage();
	}
	
});
//JR: @Matt - no idea if this still needs to exist. copied from ListContainer
ListContainer.prototype.TYPE_PAGING = "paging";
ListContainer.prototype.TYPE_SCROLL = "scroll";