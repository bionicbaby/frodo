/**
 * TODO: Give each 'item' a uniqueID property so
 * that list containers that bind to us can easily
 * remove the right display associated with our data. 
 * 
 * TODO: call this.doSort() where necessary instead of
 * worrying about calling it externally.
 */

var ArrayCollection = EventDispatcher.extend({
	
	name:"UPArrayCollection",
	//debugEnabled:true,
	
	data:[],//all of our data
	sorts:[],//our sort functions
	_sortInterval:null,//timeout to minimize sort actions
	//key for our objects. When using indexOf() and contains(), 
	// if our key is not null, we should look at our item's key value instead of the entire object.
	// we use the _table property to store the index of the item in our data associated with the given key.
	//example: our data is an array of UserVO's, key is 'userID'
	//this._table[userID] = this.indexOf(user with given userID);
	// when we call contains() or indexOf(), if a key exists, test the table.
	// otherwise test data.indexOf().
	_key:null,
	_table:{},//key/index lookup

	//Events we dispatch
	DATA_CHANGED: "frodo.arrayCollection.dataChanged",
	
	//sub-types for our events
	ADD:"frodo.arrayCollection.dataChanged.add",//indicates that an item (or items) have been added
	REMOVE:"frodo.arrayCollection.dataChanged.remove",//indicates that an item (or items) have been removed
	REPLACE:"frodo.arrayCollection.dataChanged.replace",//indicates an item has been replaced
	UPDATE:"frodo.arrayCollection.dataChanged.update",//indicates an item has been updated/changed
	RESET:"frodo.arrayCollection.dataChanged.reset",//indicates that so much has changed, that a complete reset is necessary
	SORTED:"frodo.arrayCollection.dataChanged.sorted",//indicates that the data has been sorted
	
	init:function(d, key) {
		this._super();
		if(typeof key == "string") {
			this._key = key;
		}

		this.sorts = [];
		this.autoSort = false;
		this._uniqueID = 0;
		this._rebuilding = false;
		this._table = {};
		
		//need to check to make sure d is an array!
		if(d !== null && d !== undefined && d.push !== undefined) {
				this.data = d.slice(0);//create a copy!
				if(this._key !== null) {
					this.debug("REBUILDING TABLE!", this, this._key);
					this._rebuildTable();
					this.debug("done rebuiding table:", this._table, this.data.slice(0));
				}
		} else {
			this.data = [];
		}
		
	},
	
	
	//if unique, addItem will only add the item once
	// TODO: adjust to use addItemAt
	addItem:function(item, unique) {
		this.debug("adding item:", item, unique);
		if (unique == true) {
			if(this._key !== null) {
				this.debug("addItem unique:", item);
				if(this._table[item[this._key]] !== undefined) {
					this.debug("keyed item already exists!!", item, " returning index:",  this._table[item[this._key]]);
					return this._table[item[this._key]];
				}
			} else {
				for(var i=0; i<this.getLength(); i++) {
					if(this.getItemAt(i) == item) {
						return i;
					}
				}
			}
		}
		this.debug("item is unique. adding:", item);
		//if we get here, the item is unique and can be added.
		this.data.push(item);
		//if we have a key, store this item's index in our table.
		if(this._key !== null) {
			this.debug("adding item:", this._key, item[this._key]);
			this._table[item[this._key]] = this.data.length - 1;
		}
		this._dispatchChange(this.ADD, item, this.data.length - 1);
		
		// listen for an event on the vo itself
		if ( item instanceof VO ) {
			item.removeEventListener(item.CHANGED, this._onItemChanged, this);
			item.addEventListener(item.CHANGED, this._onItemChanged, this);
		}
		
		return this.data.length - 1;
	},
	
	removeItem:function(item) {
		this.debug(this,"removeItem called with item:", item,"the key:", this._key, "index stored in key:",this._table[item[this._key]]);
		var id = this.indexOf(item);
		if(id != -1) {
			this.debug(this, "found an item to remove at index:", id);
			
			if ( item instanceof VO ) {
				item.removeEventListener(item.CHANGED, this._onItemChanged, this);
			}
			
			this.removeItemAt(id);
		} else {
			this.debug("no item to remove:", item);
		}
	},
	
	//JR: I don't see how addItemAt ever worked??
	//It doesn't appear to ever get called, and since it's a
	// pain in the nads to implement, I'm going to go ahead
	// and deprecate it's ass.
	/*
	addItemAt:function(item, index) {
		
		var b = this.data.slice(index, this.data.length);
		
		b.push(item);
		if(this._key !== null) {
			if(this._table[item[this._key]] === undefined) {
				//TODO: loop through all of our data? and fix the goddamn table..
				this._table[item[this._key]] = b.length() - 1;
			} else{
				this._table[item[this._key]] = 
			}
		}
		
		this.data.concat(b);
		this._dispatchChange(this.ADD, item, index);
	},
	*/
	removeItemAt:function(index) {
		this.debug(this, "ac removeItemAt", index);
		var item = this.data[index];
		if(item !== undefined) {
			if(this._key !== null){
				this.debug("checking for item in _table:", this._table[item[this._key]]);
				this._table[item[this._key]] = undefined;
				//delete this._table[item[this._key]];
				//JR: We also need to rebuild our _table!!
				//this._rebuildTable();
			}
			if ( item instanceof VO ) {
				item.removeEventListener(item.CHANGED, this._onItemChanged, this);
			}
			this.data.splice(index,1);//
			if(this._key !== null) {
				this._rebuildTable();
			}
			this._dispatchChange(this.REMOVE, item, index);
		}
	},
	
	getItemAt:function(index) {
		return this.data[index];
	},
	
	removeAll:function() {
		for(var i=0; i<this.data.length; i++) {
			var item = this.data[i];
			if ( item instanceof VO ) {
				item.removeEventListener(item.CHANGED, this._onItemChanged, this);
			}
		}
		this.data = [];
		this._table = {};
		//dispose of Key as well?
		this._dispatchChange(this.RESET);
	},
	
	setItemAt:function(item, index) {
		this.debug("setItemAt called:", item, index);
		this.data[index] = item;
		
		if(this._key !== null) {
			this._table[item[this._key]] = index;
		}
		
		this._dispatchChange(this.UPDATE, item, index);
	},
	
	toArray:function() {
		return this.data;
	},
	
	setCollection:function(a, key) {
		this.debug("setCollection called!", a, key);
		//TODO: deal with setting up the _key and _table
		if(key !== undefined) {
			this._key = key;
			this._table = {};
		}
		
		// loop over and unbind the change events if they are VOs
		for ( var i = 0; i < this.data.length ; i++ ) {
			var item = this.data[i];
			
			if ( item instanceof VO ) {
				item.removeEventListener(item.CHANGED, this._onItemChanged, this);
			}
			
		}
		
		//set our data to the array passed in
		this.data = a;
		
		// loop over and bind the change events if they are VOs
		for ( var j = 0; j < this.data.length ; j++ ) {
			var item = this.data[j];
			
			if ( item instanceof VO ) {
				item.addEventListener(item.CHANGED, this._onItemChanged, this);
			}
			
		}
		
		if(this._key !== undefined) {
			this._rebuildTable();
		}
		//dispatch a reset event..
		this._dispatchChange(this.RESET);
	},
	
	contains:function(item) {
		this.debug("checking for item:", item);
		if(this._key !== null && item !== null && item !== undefined) {
			this.debug("using _table and key:", item[this._key]);
			return this._table[item[this._key]] !== undefined ? this._table[item[this._key]] > -1 : false;
		}
		return (this.data.indexOf(item) > -1);
	},
	
	indexOf:function(item) {
		if(this._key !== null && item !== null && item !== undefined) {
			var r = this._table[item[this._key]] !== undefined ? this._table[item[this._key]] : -1;
			this.debug("indexOf using table and key:", r, item[this._key]);
			return r;
		}
		return this.data.indexOf(item);
	},
	
	getLength:function() {
		return this.data.length;
	},
	
	//apply any sort or filter applied
	refresh:function() {
		
	},
	
	clone:function() {
		//TODO: Deep copy the array and add a clone() method to the base VO class, or UPClass?
		return new UPArrayCollection(this.data.slice(0));
	},
	
	addSortFunction:function(f, priority) {
		//priority is optional. lower numbers are higher priority
		// if undefined, sort function gets added to the end of the list.
		if(priority !== undefined) {
			this.sorts.splice(priority, 0, f);
		} else {
			this.sorts.push(f);
			priority = this.sorts.length-1;
		}
		//this.doSort();//not sure we want to sort immediately...
		return priority;
	},
	
	doSort:function() {
		clearTimeout(this._sortInterval);
		var t = this;
		//JR: determine how long to delay based on length?
		this._sortInterval = setTimeout(function() {t._doSort();}, 1000);
	},
	
	_doSort:function() {
		this.debug("actually sorting!");
		clearInterval(this._sortInterval);
		var d = this.data.slice(0);
		if(this.sorts.length>0) {
			for(var i=0; i<this.sorts.length; i++) {
				this.data.sort(this.sorts[i]);
			}
		} else {
			//no sort functions provided. sort using builtin array method.
			this.data.sort();
		}
		//console.log(this, "sorting!", arguments);
		if(d !== this.data) {
			//dispatch an update?
			if(this._key !== null ) {
				this._rebuildTable();
			}
			this._dispatchChange(this.SORTED, null, null);
		} else {
			//console.log("no changed dispatched. data didn't change?", d, this.data);
		}
	},
	
	removeSortFunction:function(sortID) {
		this.sorts.splice(sortID, 1);
	},
	
	/** Private **/
	_rebuildTable:function() {
		
		//dump our old table.
		this._table = {};
		var a=0;
		var len = this.data.length;
		var start = new Date().getTime();
		for(a=0; a<len; a++) {
			//this.debug("setting ", this.data[a][this._key], "on table from: ", this.data[a], "to:", a);
			this._table[this.data[a][this._key]] = a;
		}
		var eTime = new Date().getTime() - start;
		this.debug("it took:", eTime, "ms to rebuild the table:", len);
	},
	
	_onItemChanged: function (event) {
		this._dispatchChange(this.UPDATE, event.context.data, this.indexOf(event.context.data));
	},
	
	_dispatchChange:function(kind, item, index) {
		//this.debug("dispatching a change!", kind, item, index, this.eventListeners);
		this.dispatchEvent(this.DATA_CHANGED, {type:kind, item:item, index:index}, false);
	},
	
	destroy:function() {
		for(var i=0; i<this.data.length; i++) {
			var item = this.data[i];
			if ( item instanceof VO ) {
				item.removeEventListener(item.CHANGED, this._onItemChanged, this);
			}
		}
		this._super();
	}
	
});
