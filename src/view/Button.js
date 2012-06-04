Button = Component.extend(/**@lends Button.prototype */{
	
	name:"Button",
	debugEnabled:true,
	
	//icon label
	viewTemplate:	"<div class='frodo-button-container'>"+
						"<span class='frodo-button-icon'></span>"+
						"<span class='frodo-button-label'></span>"+
					"</div>",
	
	disabledClass:"frodo-button-disabled",
	
	/** @Events */
	ICON_CLICK:"frodo.view.button.iconClick",
	LABEL_CLICK:"frodo.view.button.labelClick",
	BUTTON_CLICK:"frodo.view.button.buttonClick",
	
	_clickHandlers:null,//Array
	_enabled:true,
	_label:"",
	_iconClass:null,
	_iconComponent:null,
	_$label:null,
	_$icon:null,
	
	/**@constructs */
	init:function(cfg/**ConfigVO**/, label/**String*/, iconClass) {
		this._super(cfg);
		this._enabled = true;
		this._label = (label instanceof String) ? label : "";
		this._$label = this.$view.find(".frodo-button-label");
		this._$icon = this.$view.find(".frodo-button-icon");
		//we need to set a unique id for our icon view..
		this._$icon.attr("id", "frodo-button-icon-"+this._renderTime);
		//icon class can be either a string (css class) OR a javascript class.
		this._iconClass = iconClass;
		this.setIcon(this._iconClass);
		
		
		
	},
	
	bindEvents:function() {
		this._clickHandlers = [];
		
		this._clickHandlers.push( new ClickHandler(this, this.$view, this._onClick ) );
		this._clickHandlers.push( new ClickHandler(this, this.$view.find(".frodo-button-icon"), this._onIconClick ) );
		this._clickHandlers.push( new ClickHandler(this, this.$view.find(".frodo-button-label"), this._onLabelClick ) );
		
	},
	
	
	destroy:function() {
		for(var i=0; i<this._clickHandlers.length; i++) {
			this._clickHandlers[i].destroy();
		}
		this._super();
	},
	
	setLabel:function(newLabel) {
		if(typeof newLabel == "string") {
			this._label = newLabel;
			this._$label.html(this._label);
		}
	},
	
	//icon could be a UPDisplayObject, css class or html...??
	setIcon:function(className) {
		if(className !== undefined && className !== null) {
			this._iconClass = className;
			if(typeof this._iconClass == "string") {
				//attach the class to the view.
				this._$icon.addClass(this._iconClass);
			} else {
				//the class is a component class. create with view attached to our icon.
				this._iconComponent = new this._iconClass({containerId:this._$icon.attr("id")});
			}
		}
	},
	
	getIcon:function() {
		if(this._iconComponent !== null) {
			return this._iconComponent;
		} 
		return this._$icon;	
	},
	
	//this should probably be in a base class (UPDisplayObject or even lower??)!
	setEnabled:function(en) {
		this._enabled = Boolean(en);
		this.$view.toggleClass(this.disabledClass, !this._enabled);
		//TODO: disable click handlers!
		for(var i=0;i<this._clickHandlers.length; i++) {
			if(this._enabled ){
				this._clickHandlers[i].setEnabled(true);
			} else {
				this._clickHandlers[i].setEnabled(false);
			}
		}
	},
	
	//Click handlers
	//Should these all dispatch a click event as well as their individual event??
	_onClick:function(event) {
		if (this._enabled) {
			this.debug("CLICK!!");
			this.dispatchEvent(this.BUTTON_CLICK, this, false);
		}
	},
	
	_onIconClick:function(event) {
		if (this._enabled) {
			this.debug("ICON_CLICK!");
			this.dispatchEvent(this.ICON_CLICK, this, false);
			//this._onClick(event);
		}
	},
	
	_onLabelClick:function(event) {
		if (this._enabled) {
			this.debug("LABEL CLICK!");
			this.dispatchEvent(this.LABEL_CLICK, this, false);
			//this._onClick(event);
		}
	}
});
