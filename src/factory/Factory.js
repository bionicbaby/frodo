/**
 *  Factory
 **/

var Factory = EventDispatcher.extend({
	
	name: "Factory",
	
	init: function (type) {
		this.type = type;
		this.cache = new HashTable();
		this._super();
	},
	
	get: function (key) { 
		return this.cache.get(key);
	},
	
	has:function(key) {
		var item = null;
		item  = this.cache.get(key);
		if(typeof item != "undefined" && item !== null) {
			return true;
		} else {
			return false;
		}
	},
	
	set: function( key, value) {
		this.cache.set(key,value);
	},
	
	remove: function( key) {
		this.cache.remove(key);
	},
	
	create: function( instance, config ) {
		var o = new instance(config);
		// take the name of the class and automatically set it in the cache
		this.set( o.name, o); 
		return o;
	},
		
	getData: function () {
		return this.cache;
	}
	
});
