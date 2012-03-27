/**
 * TODO: Give each 'item' a uniqueID property so
 * that list containers that bind to us can easily
 * remove the right display associated with our data.
 */

var HashTable = EventDispatcher.extend({
	
	data:{},//all of our data
	array: [],
	index: {},
	hashProperty: "_item_",
	
	//Events we dispatch
	DATA_CHANGED: "hashTable.dataChanged",
	
	//sub-types for our events
	ADD:"hashTable.dataChanged.add",//indicates that an item (or items) have been added
	REMOVE:"hashTable.dataChanged.remove",//indicates that an item (or items) have been removed
	UPDATE:"hashTable.dataChanged.update",//indicates an item has been updated/changed
	
	init:function(d) {
		this._super();
		//need to check to make sure d is an object!
		if(d !== null && typeof d !== "undefined") {
			if (typeof d.push != "undefined") {
				this.data = d;
			} else {
				this.data = {};
			}
		} else {
			this.data = {};
		}
		this._uniqueID = 0;
		
		this.array = new Array();
		this.index = new Object();
		
		return this;
	},
	
	//if unique, addItem will only add the item once
	// TODO: adjust to use addItemAt
	set: function( key, value ) {
		
		//this.debug("hashTable.set",key,value)
		
		// get our fancy pants on and improve performance
		var array = this.array;
		var index = this.index;
		var hashKey = this.getHashKey(key);
		
		//this.debug("checkin on key",this.get( key ));
		
		// handle update or add
		if ( this.get( key ) ) {
			
			//this.debug("key exists updating...",value);
			
			// update array and maps objects
			// because we don't loop here we use the index table instead we now have 
			// access to the objects in an iterator by key rather than looping
			array[ index[hashKey] ] = value;
			
			// we are updating
			this._dispatchChange(this.UPDATE, data );
		} else {
			
			//this.debug("key does not existing, adding item",value);
			// add to array and maps objects
			array.push(value); // add the value to the array and set the position into the index
			index[hashKey] = array.length - 1; // associate hashed key to the index of the array
			
			// we are adding
			this._dispatchChange(this.ADD, data );
		}
		
		// set the basic data
		var data = this.data[ this.getHashKey(key) ] = value;
		
		return data;
	},
	
	get:function(key) {
		
		if ( this.data[ this.getHashKey(key) ] !== undefined ) {
			return this.data[ this.getHashKey(key) ];
		} else {
			//this.debug("key does not exist... returning null");
			return null;
		}
	},
	
	has: function(key) {
		var item = null;
		if ( this.data[ this.getHashKey(key) ] !== undefined) {
			return true;
		} else {
			return false;
		}
	},
	
	remove: function (key) {
		delete this.data[ this.getHashKey(key) ];	
		this._dispatchChange(this.REMOVE, data );	
	},
	
	getHashKey: function ( key ) {
		return this.hashProperty + key;
	},
		
	getIterator: function () {
		var result = new Iterator(this.array);
		return result;
	},	
		
	/** Private **/
	_dispatchChange:function(kind, item) {
		this.dispatchEvent(this.DATA_CHANGED, {type:kind, item:item }, false);
	}
	
	
	
});
