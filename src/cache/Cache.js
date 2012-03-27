
	var Cache = EventDispatcher.extend({
		
		name:"Cache",
		localstorage: false,
		sessionstorage: false,
		
		CLEAR: "cache.clear",
		CACHE_RESTORED: "cache.restored",
		
		_local:{},//local copy of our cache.
		
		init: function (cacheName,timeout) {
			
			this.localstorage = (typeof  window.localStorage == "undefined" ) ? false : true;
			this.sessionstorage = (typeof  window.sessionStorage == "undefined") ? false : true;
			
			this._local = {};
			this.cacheName = cacheName;
			this._super();
		},
	
		getItem: function(key) {
			if(this._local[key] !== undefined && this._local[key] !== null ) {
				return this._local[key];
			} else {
				this._local[key] = this.collection[this.getCacheKey(key)];
			}
			
			return this._local[key];//this.collection[this.getCacheKey(key)];
		},
		
		setItem: function(key,obj) {
			this._local[key] = null;
			this.collection[this.getCacheKey(key)] = obj;
		},
		
		has: function (key) {
			if ( typeof this.getItem(this.getCacheKey(key)) !== "undefined" )
			{
				return true;
			}
			return false;
		},
		
		removeItem: function (key) {
			delete this.collection[this.getCacheKey(key)];
		},
		
		getCacheKey: function (key) {
			return this.cacheName + "_" +  key;
		},
		
		clear: function () {
		}
		
	});
