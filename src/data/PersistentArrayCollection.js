var PersistentArrayCollection = ArrayCollection.extend({
	
	name:"PersistentArrayCollection",
	//debugEnabled:true,
	cacheName:"",
	cache:null,
	
	init:function( d, cache, cacheName, key ) {
		this.cache = cache;
		if (cache !== null) {
			this.cacheName = ( cacheName !== null && cacheName !== undefined ) ? cacheName : cache.cacheName;
			this._super(d, key);
			this.restoreFromCache();//call it once now, so our data is current
			// call again inside a timeout so people have an opportunity to bind to the reset
			var t = this;
			setTimeout( function() { t.restoreFromCache()}, 5 );//UGH.
		} else {
			this.error("Alert: Persistent Cache created without proper cache data:", arguments);
		}
		
	},
	
	_dispatchChange:function(kind, item, index) {
		this._super(kind, item, index);
		this.updateCache();
	},
	
	updateCache:function() {
		this.debug("Updating ArrayCollectionCache",this);
		this.cache.setItem(this.cacheName, this);
		this.debug("done", this.cache.getItem(this.cacheName));
	},
	
	restoreFromCache:function() {
		this.debug("restoring from cache!", this);
		var useSimpleData = false;
		var cacheData = this.cache.getItem(this.cacheName);
		this.debug("got cacheData:", cacheData);
		// if we have cachedData... 
		if (cacheData !== null && cacheData !== undefined) {
			
			// we need to loop over the items to turn them back into objects in an array
			var data = [];
			for ( var i = 0; i < cacheData.length; i++ ) {
				try {
				var item = JSON.parse(cacheData[i]);
					if ( item["__type__"] !== undefined ) {
						var type = eval(item["__type__"]);
						var newObj = new type();
						//JR: somehow, this screws up the scope
						// somewhere down the line... no idea how or where though...
						//newObj.setValues(item);
						
						for(var a in item) {
							newObj[a] = item[a];
							//same as setValues.. this jacks up scope in weird ways..
							//newObj.set(a, item[a]);
						}
						data.push(newObj);
						
					}
				} catch ( e ) {
					this.error("Failed to restore cacheData with typed objects", item, e );
					data.push( item );
				}
				 
			}
		} else { 
			// when we have no cacheData we should just be ok with it and setup data as a blank array	
			data = [];
		}
			
		this.setCollection(data);
		this.doSort();

	},
	
	/*
	 * @description Prepares an array collection of VOs for serailization
	 */
	
	stringify: function() {
		
		this.debug("This guy is the one sequencing the data for cache",this.data);
		// loop over the arrayCollection itself and convert the items to a simple array of prepped VOS
		var serializableData = [];
		var data = this.data;
		for ( var i = 0 ; i < data.length ; i++ ) {
			
			// check to see if the value is already stringified...
			if ( data[i].stringify !== undefined ) {
				serializableData.push( data[i].stringify() );
			} else {
				serializableData.push(data[i]);					
			}
		}
		this.debug("about to return serializableData:", serializableData);		
		return JSON.stringify(serializableData);
	}
		
});
