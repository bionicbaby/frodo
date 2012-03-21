/**
   * Cache Super Class
 **/

	var TemporaryCache = Cache.extend({
	
		CLEAR_CACHE: "clear.cache",
		
		init: function (cacheName) {
			
			// make cache site specific
			this.cacheName = cacheName;
			
			// cleanup classes inherited properties
			delete this.collection;
			
			if ( sessionStorage !== undefined ){
				// Take advantage of local storage that is persistent
				// between tabs on the same site and can store MBs of data
				this.wrapper = new SessionStorageCache(this.cacheName);
				//this.debug("TemporaryCache using SessionStorageCache");
			
				// register this cache to respond to the global clear cache command, now all persistent caches will respond to this command.
				sdk.addEventListener( this.CLEAR_CACHE, this.clear, this );
				
			} else {
			  // resort to a flash cache
			  this.wrapper = new FlashCache(this.cacheName);
			  // flash will already listen for clear_cache internally from the swf, so we dont need to do anything here for the cache clear
			  //this.debug("TemporaryCache using FlashCache");
			}
			
		},
	
		getItem: function(key) {
			return this.wrapper.getItem(key);
		},
		
		setItem: function(key,obj) {
			this.wrapper.setItem(key,obj);
		},
		
		removeItem: function (key) {
			//this.debug("TemporaryCache: removing cache",key);
			this.wrapper.removeItem(key);
		},
		
		clear: function () {
			//this.debug("clear cache called!!");
			this.getCollection().clear();
		},
		
		getCollection: function () {
			return this.wrapper.collection;
		},
		
		onChangeCallback: function (e) {
			//this.debug("data changed",e);
		}
		
	});

