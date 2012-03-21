/** UPBaseEvent.js
 * 
 *  base class for all JS Events
 *   
 **/

var Event = Class.extend({
	
	data:{},
	dataClass:VO,
	name:"Event",
	origin:null,
	
	init: function (type,dataObject) {
		this.data = new VO();
		if (typeof dataObject != "undefined") {
			this.data.setValues(dataObject);
		}
		// store origin information about what window the event was created in so we can reference back as needed.
		this.origin = {};
		this.origin.location = window.location.href;
		this.origin.window = window.self;
		if ( typeof window.name !== "undefined") {this.origin.name = window.name; } else { this.origin.name = "parent"; }
	
		this.validate();
	},
	
	validate: function () {
		throw "EVENT_VALIDATE_MISSING";
	}
	
	
});
