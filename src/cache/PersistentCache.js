/**
   * Cache Super Class
 **/

	var PersistentCache = Cache.extend({
		
		name:"PersistentCache",
		
		init: function (cacheName,timeout,forceLocalStorage) {
			
			this.timeout = timeout;
			this._super(cacheName,timeout);
			
			// cleanup classes inherited properties
			delete this.collection;
			
			if ( chrome === undefined ) {
				// Take advantage of local storage that is persistent
				// between tabs on the same site and can store MBs of data
				this.wrapper = new LocalStorageCache(this.cacheName);
				
			} else {
				this.wrapper = new ChromeExtensionCache(this.cacheName);
			}
			
		},
		
		getItem: function(key) {
			var key = this.getCacheKey(key);
			return this.wrapper.getItem(key);
		},
		
		setItem: function(key,obj) {
			var key = this.getCacheKey(key);
			this.wrapper.setItem(key,obj);
		},
		
		removeItem: function (key) {
			var key = this.getCacheKey(key);
			this.wrapper.removeItem(key);
		},
		
		clear: function () {
			try {
				this.getCollection().clear();
			} catch (e) {
				this.error("error clearing collection.", e);
			}
		},
		
		getCollection: function () {
			return this.wrapper;
		},
		
		onChangeCallback: function (e) {
			//this.debug("data changed",e);
		}
		
	});

