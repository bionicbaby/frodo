var Model = HashTable.extend({
	
	name:"Model",

	CHANGED: "sdk.model.dataChanged",
	ADD:"sdk.model.dataChanged.add",//indicates that an item (or items) have been added
	REMOVE:"sdk.model.dataChanged.remove",//indicates that an item (or items) have been removed
	UPDATE:"sdk.model.dataChanged.update",//indicates an item has been updated/changed
	
	_updateCacheDelay: 100,
	_modelName: null,
	hashProperty: "", // this must remain blank for Models, it affects the key naming convention in hashTable.
	
	init:function( name ) {
		
		this.cache = new PersistentCache("Model");
		this._super();
		// restore the overall cache for the model
		this.restoreFromCache();
		
		// setup the particular model
		this._modelName = name;
		
		// restore this particular model
		if ( model[name] !== undefined ) { // there is cached data for this model use it.
			this.debug("Model '"+ name + "' restored from cache.", model[name] );
			this.data = model[name];
		} else { // there is no cached data for this model
			this.debug("Model '"+ name + "' is empty, creating new.");
			model[name] = {};
		}
		
		return this;
		
	},
	
	/**
	 * @public
	 * @description inherits from the HashTable but also caches down the data in a fairly resource friendly manner.
	 *
	 * MT: I am using a modelCacheTimeout on the closure scope is a singleton to store the update of the cache timeout so we only every create one copy, not one
     * copy per model.  This way we don't have a ton of weight to keep the model cached...
	 *
	 */
	
	set: function (key,value) {
		// call parent
		this._super(key,value);
		
		// for backwards compatibility place the property on the object itself as well
		this[key] = value;  // THIS NEEDS TO GO AWAY, IT WILL BREAK A LOT BUT WE NEED TO REFACTOR!!!!!!!!
		
		this.updateCache();
	},
	
	
	remove: function (key) {
		// call parent
		this._super(key);
		this.updateCache();
	},
	
	updateCache: function () {
		// then go ahead and update teh cache
		var t = this;
		// clear the existing timeout
		clearTimeout(modelCacheTimeout);
		// build a new timeout
		modelCacheTimeout = setTimeout(function(){
			// we need to update the cache for all models by saving the model object itself down to localStorage
			t.cache.setItem("model",model);
			t.dispatchEvent( t.CHANGED, {data:this.data, key:null, value:null} );
		}, this._updateCacheDelay);
	},
	
	/**
	 * @public
	 * @description restores the model from cache so we have a basis to work from.
	 */
	restoreFromCache: function () {
		var cached_model = this.cache.getItem("model");
		if ( cached_model !== undefined ) {
			model = cached_model;
		}
	}
	
});
