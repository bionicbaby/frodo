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
	$view:null,
	viewID:"",
	height:0,
	width:0,
	visible:true,
	x:0,
	y:0,
	parentContainerID:null,
	locale: {},
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
			/* TODO: I thought this would be an easy way to find
			 * the controller class instance through the browser
			 * console but it didn't turn out as easy as I thought.
			 */
			/*
			this.debug("storing a reference to our controller in data");
			//store a reference to ourselves on our view?
			this.$view.data("_controller", this);
			this.debug("stored:", this.$view.data("_controller"));
			*/
		}
		
		/*
		if (this.$view !== null) {
			if ($.browser.msie) {
				this.$view.addClass("up-msie");
				if ($.browser.version == "7.0") {
					this.$view.addClass("up-msie-7");
				}
				if ($.browser.version == "8.0") {
					this.$view.addClass("up-msie-8");
				}
			}
		}
		if (this.$view !== null) {
			//store a reference to ourselves on our view?
			this.$view.data("_controller", this);
		}
		*/
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
	
	/**
	 * @description
	 * @returns {Object} the locale object.
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**@public
	 * @description add and removes status css classes to the given element, based on the status
	 * of the user.
	 * @param {UserVO} userVO
	 * @param {Object} $element
	 */
	
	setStatus: function(userVO, $element) {
		if (userVO !== null && typeof userVO != "undefined") {
			$element.removeClass("up-status-blocked");
			$element.removeClass("up-status-offline");
			$element.removeClass("up-status-xa");
			$element.removeClass("up-status-away");
			$element.removeClass("up-status-dnd");
			$element.removeClass("up-status-available");
			$element.removeClass("up-status-chat");
			$element.removeClass("up-status-pending");
			
			var blocked = rosterService.isBlocked(userVO.userID);
			this.debug("Is user blocked?", userVO.userID, blocked );
			
			if ( userVO.online && !blocked ) { // && userVO.status !== "Offline"
				$element.addClass("up-status-" + String(userVO.show).toLowerCase());
			}
			else if ( userVO.pending && !blocked ) {
				$element.addClass("up-status-pending");
			}
			else if ( userVO.blocked || blocked ) {
				$element.addClass("up-status-blocked");
			}
			else {
				$element.addClass("up-status-offline");
			}
		}
	},
	
	prettyDate: function(time){
		var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);
				
		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;
				
		return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "1 hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
			day_diff == 1 && "Yesterday" ||
			day_diff < 7 && day_diff + " days ago" ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
	}
	
 });

 