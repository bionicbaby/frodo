var ItemRenderer = DisplayObject.extend({
	
	name:"ItemRenderer",
	//debugEnabled:true,
	
	_baseClass:"up-item-renderer",
	selectedClass:"up-item-renderer-selected",
	
	RENDERED:"sdk.ui.itemRenderer.rendered",//hopefully going away..
	ITEM_SELECTED:"sdk.ui.itemRenderer.itemSelected",
	REQUEST_REMOVE:"sdk.ui.itemRenderer.requestRemove",
	
	data:{},
	
	init:function(cfg, data ) {
		this._super(cfg);
		if(data !== null && typeof data != "undefined") {
			this.setData(data);
		}
		
		this.bindEvents();
		var t = this;
		setTimeout(function(){t.dispatchEvent(t.RENDERED, {item:t}, false);}, 25);
	},
	
	bindEvents:function() {
		//TODO: use UPClickHandler and store references so that we can destory
		// them when we get destroyed.
		this.$view.bind( "click", $.proxy( this._onItemSelected , this ) );
		this.$view.bind( "mouseover", $.proxy( this._onMouseOver, this ) );
		this.$view.bind( "mouseout", $.proxy( this._onMouseOut, this ) );
		
		//this._super();
	},
	
	bindData:function() {
		this.$view.html(this.data);
	},
	
	setData:function(data) {
		this.data = data;
		
		if(this.data instanceof VO) {
			this.data.removeEventListener(this.data.CHANGED, this.bindData, this);
			this.data.addEventListener(this.data.CHANGED, this.bindData, this);
		}
		
		this.bindData();
	},
	
	requestRemove:function() {
		this.debug("requesting remove! ", this);
		this.dispatchEvent(this.REQUEST_REMOVE, {renderer:this}, false);
	},
	
	setSelected: function(b){
		this.selected = b;
		if (this.selected) {
			this.$view.addClass(this.selectedClass);
		}
		else {
			this.$view.removeClass(this.selectedClass);
		}
	},
	
	_onItemSelected: function () {
		this.debug("_onItemSelected");
		this.dispatchEvent( this.ITEM_SELECTED, {renderer:this, item:this.data}, false);
	},
	
	_onMouseOver: function (event) {
		this.$view.addClass("up-item-hover");
	},
	
	_onMouseOut: function (event) {
		this.$view.removeClass("up-item-hover");
	},
	
	_onResize:function(event) {
		
	},
	
	destroy:function() {
		if(this.data instanceof VO) {
			this.data.removeEventListener(this.data.CHANGED, this.bindData, this);
		}
		this._super();
	}
	
	
});
