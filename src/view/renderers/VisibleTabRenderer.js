var VisibleTabRenderer = ItemRenderer.extend({
	
	name:"VisibleTabRenderer",
	debugEnabled:true,
	
	viewTemplate: "<li>" +
					"<div class='visible-tab-header'></div>"+
					"<div class='visible-tab-child'></div>"+
					"<div class='visible-tab-button'></div>"+
				"</li>",
				  
	viewClass:"frodo-visible-tab",
	
	_button:null,
	_closeButton:null,
	_childContent:null,
	
	draw:function() {
		
		this._super();
		//attach the main 'tab' button
		//attach this to the visible-tab-child-button element.
		var uID = "visible-tab-button-" + this._renderTime + (Math.round(Math.random() * 10000));
		this.debug("uID:", uID);
		this.$view.find(".visible-tab-button").attr("id", uID);
		this._button = new Button({containerId:uID});
		this.debug("done with the button?", this._button);
		//listen for clicks on the button
		this._button.addEventListener(this._button.BUTTON_CLICK, this._onButtonClick, this);
		
		//create a close button to use as the button icon. (not quite working, needs css lovin')
		//this._button.setIcon(Button);
		//this._button.getIcon.setStyle("tab-close-button");
		//create our child content.
		this.$view.find(".visible-tab-child").attr("id", "tab-child-"+this._renderTime);
	},
	
	bindEvents:function() {
		//overriding (not calling _super() ) to avoid adding mouse events to the entire renderer.
		//TODO:bind to window resize event!
		
		//this._super();
	},
	
	
	
	setData:function(data) {
		this.debug("setData called", data);
		this._super(data);
		//this.debug("binding to window resize..", this.bindData, this.$view);
		//$(window).resize($.proxy(this.bindData,this));
	},
	
	bindData: function() {
		//this.$view.html(this.data.label);
		this.debug("visible tab:", this,this.$view);
		this.debug("is visible?:", this.$view.is(":visible"));
		this.data.set("visible", this.$view.is(":visible"));
		this._button.setLabel(this.data.label);
		if(this._childContent === null) {
			var renderer = eval(this.data.type);
			this.debug("renderer:", renderer, typeof renderer);
			this._childContent = new renderer({containerId:this.$view.find(".visible-tab-child").attr("id")}, this.data.data);
		}
		if(this.data.active) {
			this._childContent.show();
		}else {
			this._childContent.hide();
		}
	},
	
	onResize:function(event) {
		this.debug("VTR onResize");
		this.bindData();
	},
	
	_onButtonClick:function(event) {
		this.debug("button clicked!!");
		//TODO: dispatch an item_selected event that our tab container can consume..
		this.dispatchEvent(this.ITEM_SELECTED, {item:this}, false);
		//if Minimizeable...
		this._childContent.toggle();
	}
});
