/**
 * SessionStorageCache Class
 **/

	var SessionStorageCache = Cache.extend({
	
		init: function (cacheName) {
			//this.debug("instantiating local storage cache");
			this.cacheName = hash(cacheName); // hash the cache name to keep it safe for the cache mechanism
			this.collection = window.sessionStorage;
			this.iterator = new SessionStorageIterator(this.collection);
			this.onChangeCallback = function (e) { /*dont do anything by default*/ };
		},
	
		getItem: function(key) {
			var item = this.collection.getItem( this.getCacheKey(key) );
			if (item != null) {
				return JSON.parse(item);
			}
			return item;
		},
		
		setItem: function(key,obj) {
			key = this.getCacheKey(key);
			
			
			try {
				//if(typeof obj != "string") {
					obj = JSON.stringify(obj);
				//}
				window.sessionStorage.setItem(key,obj);
			}
			
			catch ( e ) {

				
				// going to supress this error: "" as it does not impact storage.
				// this error only happens in FF 3.6.x near as I can tell but it does not affect things.
				if ( e.message === "Component returned failure code: 0x80630002 [nsIDOMStorage.setItem]")
				{
					// ignore this state
					
				} else {
					this.debug("caught an error trying to set an item",e, this.getCacheKey(key), obj, window.sessionStorage.getItem(key) );
				}
			}
		},
		
		has: function (key) {
			if ( typeof this.getItem(this.getCacheKey(key)) != "undefined" )
			{
				return true;
			}
			return false;
		},
		
		removeItem: function (key) {
			//this.debug("SESSION: attempting to remove item from cache",key)
			window.sessionStorage.removeItem(this.getCacheKey(key));
		},
		
		error: function (e) {
			//this.debug("error:", e);
			/*if ( e == QUOTA_EXCEEDED_ERR )
			{
				alert("out of space!");
				this.outOfSpace();
			}*/
			
		},
		
		outOfSpace: function ( e ) {
			
		},
		
		getIterator: function () {
			return this.iterator;
		}
		
	});