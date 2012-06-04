/** @class DisplayObject
 * @extends EventDispatcher
 */ 
var DisplayObject = EventDispatcher.extend(/**@lends DisplayObject.prototype */{
 	
	name:"DisplayObject",
	
	/** @private
	 * @description the html template used to display a DisplayObject. 
	 */
	viewTemplate:"<div></div>",
	/** @private
	 * @description the css class to attach to the view. 
	 */
	viewClass:null,
	/**@private
	 * @description reference to our dom view elements.
	 */
	$view:null,
	/**@private
	 * @description the id attached to our view dom element.
	 */
	viewID:"",
	
	height:0,
	width:0,
	/**@public
	 * @description whether or not our $view is visible.
	 */
	visible:true,
	/**@public
	 * @description reference to our 
	 */
	x:0,
	y:0,
	parentContainerID:null,
	locale: {},
	_parent:null,//reference to the object instance that created us
	
	/** @constructs */
	init:function(configVO) {
		
		if(configVO) {
			this.height = configVO.height;
			this.width = configVO.width;
			if(configVO.containerId){ 
				this.parentContainerID = configVO.containerId;
			} else {
				this.debug("NO CONTAINERID, using 'body'", this);
				this.parentContainerID = "body";
			}
			if(configVO.parent !== null && configVO.parent !== undefined) {
				this._parent = parent;
			} else {
				this._parent = window;
			}
			if(configVO.label !== undefined && configVO.label !== null) {
				this.label = configVO.label;
			}
		}	
		this._super();
		this.draw();
		
	},
	
	/** @private */
	draw:function() {
		
		if (this.$view !== null) {
			this.$view.remove();
			this.$view = null;
		}
		if(this.viewTemplate) {
			this.$view = $(this.viewTemplate);
			this.$view.attr("id", this.name+"-" + ( this._renderTime - Math.floor(Math.random()* 10000000) ) );
		}
		if(this.viewClass) {
			this.$view.addClass(this.viewClass);
		}
		
		if (this.parentContainerID == "body") {
			$(this.parentContainerID).append(this.$view);
		} else {
			$("#" + this.parentContainerID).append(this.$view);
		}
		if (this.$view !== null) {
			
			//store a reference to our view's id
			this.viewID = this.$view.attr("id");
			
			// add IE specific classes so we can style against it using a className
			if ($.browser.msie) {
				this.$view.addClass("up-msie");
				/*if ($.browser.version == "7.0") {
					this.$view.addClass("up-msie-7");
				}*/
				if ($.browser.version == "8.0") {
					this.$view.addClass("up-msie-8");
				} 
				if ($.browser.version == "9.0") {
					this.$view.addClass("up-msie-9");
				}
			}
			
		}
		
		
	},
	/**
	 * @function
	 * @param {string} animation (optional)
	 */
	show : function() {
		if (arguments.length == 1) {
			//most likely a string..
			switch(arguments[0]) {
				case "slow":
					this.$view.show("slow");
				break;
				case "fast":
					this.$view.show("fast");
				break;
				case "fadeIn":
					this.$view.fadeIn();
				break;
				default:
					this.$view.show(arguments);
				break;
			}
		} else if(arguments.length>1) {
			this.$view.show.apply(this.$view, arguments);
		} else {
			this.$view.show();
		}
	},
	
	/**
	 * @public
	 * @param {string} animation (optional)
	 */
	hide : function() {
		if (arguments.length == 1) {
			//most likely a string..
			switch(arguments[0]) {
				case "slow":
					this.$view.hide("slow");
				break;
				case "fast":
					this.$view.hide("fast");
				break;
				case "fadeOut":
					this.$view.fadeOut();
				break;
				default:
					this.$view.hide(arguments);
				break;
			}
		} else if(arguments.length>1) {
			//this.$view.call("hide", arguments);
			this.$view.hide.apply(this.$view, arguments);
		} else {
			this.$view.hide();
		}
	},
	
	/**
	 * @description toggles the display object's visibility
	 */
	toggle:function() {
		return this.$view.toggle();
	},
	
	/**
	 * @private
	 */
	destroy:function() {
		if (this.$view !== null && this.$view !== undefined) {
			this.$view.remove();
			this.$view = null;
		}
		this._super();
	},
	
	/**
	 * @param {Object} locale the locale object to use.
	 */
	setLocale:function(locale) {
		this.locale = locale;
	},
	
	/**@public
	 * @description
	 * @returns {Object} the locale object.
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**@public
	 * @description sets a css style
	 * @param {String} className
	 */
	setStyle:function(className) {
		if(className !== undefined) {
			this.$view.addClass(className);
		}
	}
	
 });

 