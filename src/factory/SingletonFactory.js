/**
 *  Factory
 **/

var SingletonFactory = Factory.extend({
	
	name: "SingletonFactory",
	
	SINGLETON_EXCEPTION: "SingletonException",
	
	set: function (key,value) {
		// The service factory should instantiate singletons...
		if ( this.has(key) ) {
			throw this.SINGLETON_EXCEPTION;
		} else {
			this._super(key,value);
		}
	}

});
