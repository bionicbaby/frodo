/**
 * LocalStorageCache Class
 **/

	var LocalStorageCache = Cache.extend({
	
		init: function (cacheName) {
			this.collection = window.localStorage;
			this._super(cacheName);
		},
	
		getItem: function(key) {
			var localItem = this._local[key];
			//return the copy in local memory
			if(localItem !== null && localItem !== undefined) {
				return localItem;
			}
			//if no local mem. item found, get it from the cache
			var item = this.collection.getItem( key );
			
			if (typeof item == "string") {
				try {
					if ( item === undefined || item === null || ! String(item).length ) {
						return null;
					}
					var result = JSON.parse(item);
				}catch(e) {
					this.error("ERROR calling JSON.parse.", e, key, item);
					return null;
				}
			}
			this._local[key] = result;
			return result;
		},
		
		setItem: function(key, obj) {
			var store = this.collection;
			var strObj = "";
			//erase the local memory copy.
			this._local[key] = null;
			
			if (obj == null) {
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
		
		error: function (e) {
			this.debug("error:", e);
			/*if ( e == QUOTA_EXCEEDED_ERR )
			{
				alert("out of space!");
				this.outOfSpace();
			}*/
			
		},
		
		outOfSpace: function ( e ) {
			
		},
		
		clear: function () {
			localStorage.clear();
		}
		
	});