/** @class Component
	 * @extends BaseClass
	 * @description Component is a basic container of modular view logic.  Components small or large are visual in nature.  If you want to build something that is
	 * @description not visual in nature but needs a similiar container logic wise please see the Module class.
	 * @see Module
	 */
var Component = DisplayObject.extend(/**@lends Component.prototype */{
	
	UPDATE: "component.update",
	CREATE: "component.create",
	DESTROY: "component.destroy",
	DISPLAY: "component.display",
	
	name:"Component",
	
	//public vars
	/** @public*/
	containerTemplate : "<div id='container'></div>",
	backgroundTemplate:"<div id='background'></div>",
	loadingTemplate: null,
	contentTemplate:"<div id='content'></div>",
	disconnectedTemplate: null,
	viewTemplate:null,
	
	styles:{
		content:{},
		bg:{},
		container:{},
		loading:{}
	},
	
	containerID : "frodo-component-container",
	backgroundID : "frodo-component-background",
	loadingID : "frodo-component-loading",
	contentID : "frodo-component-content",
	disconnectedID : "frodo-component-disconnected",
	
	containerClass:"frodo-component-container",//class name for our container
	contentClass:"frodo-component-content",//class name for our content
	backgroundClass:"frodo-component-background",//class name for our background
	loadingClass:"frodo-component-loading",//class name for our loading div
	disconnectedClass:"frodo-component-disconnected",//class name for our loading div
	viewClass:null,
	hoverClass:"frodo-component-hover",// class name that appears when hovering over component
	
	showAnimation:null,
	hideAnimation:null,
	$view : null,//our entire view, starting at the container
	$contentView:null,// the view (DOM) holding our content
	$loadingView:null,//the view holding our loading content
	$bgView:null,
	parentContainerID : "",//our parent container ID
	id : "",
	loading:false,
	eventBindings:[],
	resizeProxy:null,
	fullHeight:false,
	
	hideInspector: null,
	
	//constructor
	init: function (configVO) {
		// set a copy of the config into the class
        this._config = configVO;
        
		if (configVO != undefined) {
			this.parentContainerID = configVO.containerId;
			
			if ( configVO.contentClass !== undefined ) this.contentClass = configVO.contentClass;
			if ( configVO.containerClass !== undefined ) this.containerClass = configVO.containerClass;
			if ( configVO.backgroundClass !== undefined ) this.backgroundClass = configVO.backgroundClass;
			if ( configVO.viewClass !== undefined ) this.viewClass = configVO.viewClass;
			
			this._super(configVO);
		} else {
			this._super();
		}
		this.bindData();
		this.resizeProxy = null;
		this.bindEvents();
		this.bindCSS();
		/*
		if(this.loadingTemplate !== undefined && this.loadingTemplate !== null) {
			this.setLoading(this.loading);
		}
		*/
		//dispatch a component_created event
		var t = this;
		setTimeout(function() {t.dispatchEvent(t.CREATE, {reference:t}, false)},50 );
	},
	
	draw : function() {

		//draw it!
		this._super();

		if( this.$view === null) {
			
			if(this.containerTemplate) {
				this.$view = $(this.containerTemplate);
				this.$view.addClass(this.containerClass);	
				
				// add rtl/ltr specific classes for the containers 
				// add RTL identifier if necessary
				this.$view.addClass("frodo-"+this.getLocale().direction);
				// add IE specific classes so we can style against it using a className 
				if ( $.browser.msie ) {
					this.$view.addClass("frodo-msie");
						if ( $.browser.version == "7.0" ) {
							this.$view.addClass("frodo-msie-7");
						}
						if ( $.browser.version == "8.0" ) {
							this.$view.addClass("frodo-msie-8");
						} 
						if ($.browser.version == "9.0") {
							this.$view.addClass("frodo-msie-9");
						}
				}
				
			} else {
				return;
			}
			
			var uniqueId = ( this._renderTime - Math.floor(Math.random()* 10000000) );
			
			this.containerID = this.name+"-"+this.containerID+ "-"+uniqueId;
			this.$view.attr("id", this.containerID);
			
			if (this.backgroundTemplate) {
				this.$bgView = $(this.backgroundTemplate);
				//bg.addClass(this.backgroundClass);
				this.$bgView.attr("id", this.backgroundID+"-"+uniqueId);
				this.$view.append(this.$bgView);
			}
			
			if (this.loadingTemplate) {
				this.$loadingView = $(this.loadingTemplate);
				//this.$loadingView.addClass(this.loadingClass);
				this.$loadingView.attr("id", this.loadingID+"-"+uniqueId);
				this.$bgView.append(this.$loadingView);
			}
			if (this.contentTemplate) {
				
				this.$contentView = $(this.contentTemplate);
				//this.$contentView.addClass(this.contentClass);
				this.contentID = this.contentID+"-"+uniqueId;
				this.$contentView.attr("id", this.contentID);
				this.$bgView.append(this.$contentView);
			}
			if (this.disconnectedTemplate ) {
				
				this.$disconnectedView = $(this.disconnectedTemplate);
				this.$disconnectedView.addClass(this.disconnectedClass);
				this.disconnectedID = this.disconnectedID+"-"+uniqueId;
				this.$disconnectedView.attr("id", this.disconnectedID);
				this.$view.append(this.$disconnectedView);
				this.$disconnectedView.hide();
			}
			
			
		} else {
			this.debug("the view is not null!");
			
		}

		if (this.parentContainerID == "body") {
			$(this.parentContainerID).append(this.$view);
		} else {
			$("#" + this.parentContainerID).append(this.$view);
		}
		
		this.$view.addClass("frodo-component");
		// dispatch a display_component event so the plugins can listen for the rendering.
		this.dispatchEvent( this.DISPLAY, {type: this.name, reference: this, eventType:"draw" }, false );
	},
	
	injectContent: function(parentID, content) {
		//try raw input first
		var $targetView = this.$view.find(parentID);
		if($targetView.length == 0) {
			//not found, try forcing an id selector
			$targetView = this.$view.find("#"+parentID);
		}
		if($targetView.length == 0) {
			//still not found, try with jquery
			$targetView = $(parentID);
		}
		var $c = $(content);
		//finally, append!
		if($targetView.length > 0) {
			$targetView.append($c);
		}
		return $c;
	},
			
	//bind event listeners
	// TODO: modify to allow binding multiple events to the same handler...
	// example: ["AV_HIDDEN","AV_SHOWN", this.resize]
	bindEvents: function() {
		
		if(this.$view !== null) {
			// JASON: binding mouseover and mouseout events to add / remove hover classes,
			// so that we can style against them
			this.$view.bind( "mouseover", $.proxy( this._onMouseOver, this ) );
			this.$view.bind( "mouseout", $.proxy( this._onMouseOut, this ) );
		}
		
	},
	
	destroy:function() {
		this.dispatchEvent(this.DESTROY, {type: this.name, reference: this, eventType:"update" }, false );
		this._super();
	},
	
	bindData:function() {
		this.dispatchEvent(this.UPDATE, {type: this.name, reference: this, eventType:"update" }, false );
	},
	
	setSize:function(h,w) {

		this.$view.width(w);
		this.$view.height(h);
	},
	
	resize:function() {
		//this.debug("UPcomponent handling resize for:", this.name);
	},
	
	bindCSS:function() {
		
		/** bind any css styles
		 * that we have defined, and THEN
		 * call addClass on our views to *hopefully* override
		 * with what's in the css sheets
		 */

		for(var v in this.styles) {
			var view;
			if(v == "container"){
				view = this.$view;
			} else {
				view = this["$"+v+"View"];
			}
	
			if (view) {
				for(var s in this.styles[v]) {
					view.css(s, this.styles[v][s]);
				}
			}
		}
		
		//Apply stylesheets
		if(this.$view) {
			this.$view.addClass(this.containerClass);
		}
		if (this.$bgView) {
			this.$bgView.addClass(this.backgroundClass);
		}
		if (this.$contentView) {
			this.$contentView.addClass(this.contentClass);
		}
		if (this.$loadingView) {
			this.$loadingView.addClass(this.loadingClass);
		}
	},
	
	setLoading: function(loading) {
		
		this.loading = loading;
		if ((this.$loadingView !== null && this.$loadingView !== undefined)  
				&& (this.$contentView !== null && this.$contentView !== undefined)) {
			if (loading) {
				//draw the loading view, hide content
				this.$contentView.hide();
				this.$loadingView.show();
			} else {
				//hide the loading view, show content/
				this.$loadingView.hide();
				this.$contentView.show();
			}
		}
	},
	
	_onMouseOver: function (event) {
		this.$view.addClass(this.hoverClass);
	},
	
	_onMouseOut: function (event) {
		this.$view.removeClass(this.hoverClass);
	},
	
	_onDisconnecting: function (event) {
		this.$disconnectedView.show(this.showAnimation);
	}
	,
	
	_onDisconnected: function (event) {
		this.$disconnectedView.show(this.showAnimation);
	}
	,
	
	_onConnected: function (event) {
		this.$disconnectedView.hide(this.showAnimation);
	},
	
	_onReconnect: function (event) {
		// we dont do anything by default in here...
	}
	
});