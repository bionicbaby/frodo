/**
 * LocalStorageCache Class
 **/

	var LocalStorageCache = Cache.extend({
		
		name:"LocalStorageCache",
		//debugEnabled:true,
		
		init: function (cacheName) {
			
			this.collection = window.localStorage;
			// if a changeCallback was provided we can bind the results here so that when a chance occurs we call it
			//if ( typeof onChangeCallback != "undefined" && onChangeCallback != null ) {
			//	this.onChangeCallback = onChangeCallback;
				// register callback with the local storage cache
			//} else {
				//this.debug("setting up callback for data change to base handler");
				//this.onChangeCallback = function (e) { /*dont do anything by default*/ };
			//}
			
			/*userplane.$(window).bind( "onstorage", userplane.$.proxy(this.onChangeCallback, this) );
			userplane.$(window).bind( "storage", userplane.$.proxy(this.onChangeCallback, this) );
			if (window.addEventListener) { window.addEventListener("storage", handle_storage, false); } else { window.attachEvent("onstorage", handle_storage); };
			function handle_storage(e) { if (!e) { e = window.event; } }
			*/
			this._lastUpdate = this.collection.getItem("lastUpdate");
			this._super(cacheName);
		},
	
		getItem: function(key) {
			var localItem = this._local[key];
			//return the copy in local memory
			//JR: disabled, as this causes problems when one window updates the cache
			  //and another needs to know about the change it made.
			  //if possible, we may need to listen for the cache to change
			  // and use that change to invalidate our local data..
			
			if(localItem !== null && localItem !== undefined) {
				//before returning the localItem, check our lastUpdate against
				// the lastUpdate in the cache. if different, restore from cache!
				;
				var cLastUpdate = this.collection.getItem("lastUpdate");
				if(cLastUpdate !== undefined && cLastUpdate !== null) {
					if(cLastUpdate == this._lastUpdate) {
						this.debug("returning localItem:",key, localItem);
						return localItem;
					} else {
						this.debug("NOT returning localItem. going to cache...", key, localItem);
					}
				}
			}
			
			//if no local mem. item found, get it from the cache
			var item = this.collection.getItem( key );
			//this.error("getItem called with key:", key, item);
			if (typeof item == "string") {
				try {
					if ( item === undefined || item === null || ! String(item).length ) {
						return null;
					}
					
					var result = JSON.parse(item);
					//this.error("parsed an item and returning:", item, result);
				}catch(e) {
					this.error("ERROR calling JSON.parse.", e, key, item);
					return null;
				}
			}
			this._local[key] = result;
			this._lastUpdate = this.collection.getItem("lastUpdate");
			this.debug("returning item from cache:",  key, result, this._lastUpdate);
			return result;
		},
		
		setItem: function(key, obj) {
			var store = this.collection;
			var strObj = "";
			var ts = new Date().getTime();
			this._lastUpdate = ts;
			
			//erase the local memory copy.
			this._local[key] = null;
			
			if (obj == null) {
				store.setItem("lastUpdate", ts);
				store.setItem(key, obj);
				return;
			}
		
			if ( obj instanceof SerializableVO || obj instanceof PersistentArrayCollection ) {
				//use the object's custom stringify
				//this.debug("using the objects stringify:",obj.stringify())
				strObj = obj.stringify();
			}
			else {
				//generic JSON stringify
				//this.debug("using JSON.stringify")
				strObj = JSON.stringify(obj);	
			}
			
			
			store.setItem(key, strObj);
			
			store.setItem("lastUpdate", ts);
			//dispatch a global cache_change event
			//sdk.dispatchEvent(UserplaneEvents.CACHE_CHANGE, {key:key}, false);
			/*
			try {}
			catch ( e ) {

				
				// going to supress this error: "" as it does not impact storage.
				// this error only happens in FF 3.6.x near as I can tell but it does not affect things.
				if ( e.message === "Component returned failure code: 0x80630002 [nsIDOMStorage.setItem]")
				{
					// ignore this state
					sdk.debug("FF LOCALSTORAGE ERROR!! in setItem:", key, strObj);
					
				} else {
					this.error("caught an error trying to set an item:", key, obj, this.collection.getItem(key), e);
				}
			}*/
		},
		
		has: function (key) {
			if ( typeof this.getItem( key ) != "undefined" )
			{
				return true;
			}
			return false;
		},
		
		removeItem: function (key) {
			this.collection.removeItem(key);
		},
		
		outOfSpace: function ( e ) {
			
		},
		
		clear: function () {
			localStorage.clear();
		}
		
	});