var PersistentArrayCollection = ArrayCollection.extend({
	
	name:"PersistentArrayCollection",
	//debugEnabled:true,
	cacheName:"",
	cache:null,
	type: null,
	
	init:function( d, cache, cacheName, type ) {
		this.cache = cache;
		if ( type !== undefined ) {
			this.type = type;
		}
		if (cache !== null) {
			this.cacheName = ( cacheName !== null && cacheName !== undefined ) ? cacheName : cache.cacheName;
			this._super(d);
			// call inside a timeout so people have an opportunity to bind to the reset
			//var t = this;
			//setTimeout( function() { t.restoreFromCache()}, 1000 );
			this.cache.addEventListener( this.cache.CACHE_RESTORED, this.restoreFromCache, this );
		} else {
			this.error("Alert: Persistent Cache created without proper cache data:", arguments);
		}
		
	},
	
	_dispatchChange:function(kind, item, index) {
		this._super(kind, item, index);
		this.updateCache();
	},
	
	updateCache:function() {
		console.log("Updating ArrayCollectionCache",this.data);
		this.cache.setItem(this.cacheName, this);
	},
	
	restoreFromCache:function() {
		var useSimpleData = false;
		var cacheData = this.cache.getItem(this.cacheName);
		console.log("Restoring from cache",cacheData);
		
		// if we have cachedData... 
		if (cacheData !== null && cacheData !== undefined) {
			
			// we need to loop over the items to turn them back into objects in an array
			var data = [];
			for ( var i = 0; i < cacheData.length; i++ ) {
				try {
					
					if ( cacheData[i].__type__ === undefined ){ 
						var item = JSON.parse(cacheData[i]);
					} else {
						var item = cacheData[i];
					}
				
					if ( item["__type__"] !== undefined ) {
						// if the type is not provided for the AC then try to evaluate it using the __type__ property
						if ( this.type === null ) {
							var type = eval(item["__type__"]);
						} else {
							var type = this.type;
						}
						var newObj = new type();
						for(var a in item) {
							newObj[a] = item[a];
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
		
		console.log("about to reset the AC data",data);
			
		this.setCollection(data);

	},
	
	getSerializableData: function () {
		var serializableData = [];
		var data = this.data;
		// there is no need to serialize this data in a chrome extension simply to get the serializable data.
		if ( chrome !== undefined ) {
			for ( var i = 0 ; i < data.length ; i++ ) {
				// check to see if the value is already stringified...
				if ( data[i].getSerializableData !== undefined ) {
					serializableData.push( data[i].getSerializableData() );
				} else {
					serializableData.push(data[i]);					
				}
			}
			
		} 
		// if its not a chrome extension we should serialize.
		else {
			for ( var i = 0 ; i < data.length ; i++ ) {
				// check to see if the value is already stringified...
				if ( data[i].stringify !== undefined ) {
					serializableData.push( data[i].stringify() );
				} else {
					serializableData.push(data[i]);					
				}
			}
		}
		return serializableData;
	},
	
	/*
	 * @description Prepares an array collection of VOs for serailization
	 */
	
	stringify: function() {
		
		//console.log("This guy is the one sequencing the data for cache");
		// loop over the arrayCollection itself and convert the items to a simple array of prepped VOS
		
		//console.log("done stringifying the data ",serializableData,this.data);
				
		return JSON.stringify( this.getSerializableData() );
	}
		
});
