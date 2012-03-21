/**
 * ClickHandler
 * 
 * description: A wrapper for click events. IE8 triggers an onBeforeUnload event
 * whenever a javascript href is clicked. We use event.preventDefault() to keep
 * this from happening.
 * 
 * @param {Object} owner
 * @param {Object} button
 * @param {Object} handler
 */

var ClickHandler = Class.extend({
	handler:null,
	owner:null,
	button:null,
	
	init:function(owner, button, handler) {
		
		this.handler = handler;
		this.owner = owner;
		this.button = button;
		// check if button is a string, if so
		// use live, other wise assume it's a dom object
		var t = this;
		var f = function(event) {
			return t.onClick(event);
		};
		if (typeof button == "string") {
			$("."+button).live("click", f);
		}
		else {
			button.click(f);
		}
	},
	
	onClick: function(event) {
		this.handler.call(this.owner, event);
		event.preventDefault();
	},
	
	destroy:function() {
		if(this.button !== undefined) {
			if (typeof this.button == "string") {
				$("." + this.button).die("click");
			}
			else {
				this.button.unbind("click");
			}
		}
		this._super();
	}
});
