var TabContainer = Component.extend(/**@lends TabContainer.prototype */ {
	
	name:"TabContainer",
	debugEnabled:true,
	
	_dataProvider:null,
	//_visibleDp:null,
	_overflowDp:null,
	_visibleList:null,
	_overflowList:null,
	_tabs:null,
	_cache:null,
	_minimizeAble:true,
	
	alignment:"bl", //where we want the edge of the focused tab to align to.(bl=bottom left of the tab, c=centered in tabbar, fs:full width of tab bar)
	
	contentClass:"frodo-tabcontainer-content",
	backgroundClass:"frodo-tabcontainer-background",
	containerClass: "frodo-tabcontainer-container",
	
	
	init: function (config) {
		this.debug("created with config:", config);
		this._super(config);
		this._cache = new PersistentCache(this.label);//use label to locate our cache
		this._dataProvider = new PersistentArrayCollection([], this._cache, this.label, "index");
		this._createWidgets();
		window.dp = this._dataProvider;//TEMP
		window.odp = this._overflowDp;//TEMP
	},
	
	bindEvents:function() {
		this._super();
		this.debug("binding to window resize..", this.bindData, this);
	},
	
	_createWidgets:function() {
		if(this._dataProvider instanceof ArrayCollection) {
			
			//this._visibleDp = new FilteredArrayCollection(this._dataProvider, {visible:true});//unneccessary..
			//filtered dataProvider for overflow list
			this._overflowDp = new FilteredArrayCollection(this._dataProvider, {visible:false});
			
			//use original dataProvider for visibleList
			this._visibleList = new ListContainer({containerId:this.contentID}, this._dataProvider, VisibleTabRenderer);
			this._visibleList.addEventListener(this._visibleList.ITEM_SELECTED, this._onVisibleSelected, this);
			
			this._overflowButton = new Button({containerId:this.contentID});
			this._overflowButton.hide();
			this._overflowButton.addEventListener(this._overflowButton.BUTTON_CLICK, this._onOverflowClick, this);
			this._overflowList = new ListContainer({containerId: this.contentID}, this._overflowDp,OverflowTabRenderer);
			this._overflowList.addEventListener(this._overflowList.ITEM_SELECTED, this._onOverflowSelected, this);
			this._overflowList.hide();
		}
	},
	
	//new tabs should be prepended to the list and then given an id.
	addTab:function(label, componentClass, data) {
		var tabVO = new TabVO(label, componentClass, data);
		tabVO.set("index", this._dataProvider.getLength());
		this._dataProvider.addItem(tabVO);
	},
	
	//how do we key the tabs?
	removeTab:function() {
		
	},
	
	_updateIndexes:function() {
		
	},
	
	//handler for clicking the overflow button
	_onOverflowClick:function(event) {
		
	},
	
	_onVisibleSelected:function(event) {
		this.debug("onVisibleSelected:", event);
	},
	
	_onOverflowSelected:function(event) {
		this.debug("onOverflowSelected:", event);
	}
	
	
	
	
});

