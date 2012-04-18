/**
 * TODO: Give each 'item' a uniqueID property so
 * that list containers that bind to us can easily
 * remove the right display associated with our data. 
 * 
 * TODO: call this.doSort() where necessary instead of
 * worrying about calling it externally.
 */

var ArrayCollection = EventDispatcher.extend({
	
	name:"ArrayCollection",
	//debugEnabled:true,
	
	data:[],//all of our data
	localIndex:[],//resulting array of any sort/filter applied
	filters:[],//list of filters to apply to our data
	sorts:[],//our sort functions
	_sortInterval:null,
	
	//Events we dispatch
	DATA_CHANGED: "frodo.arrayCollection.dataChanged",
	
	//sub-types for our events
	ADD:"frodo.arrayCollection.dataChanged.add",//indicates that an item (or items) have been added
	REMOVE:"frodo.arrayCollection.dataChanged.remove",//indicates that an item (or items) have been removed
	REPLACE:"frodo.arrayCollection.dataChanged.replace",//indicates an item has been replaced
	UPDATE:"frodo.arrayCollection.dataChanged.update",//indicates an item has been updated/changed
	RESET:"frodo.arrayCollection.dataChanged.reset",//indicates that so much has changed, that a complete reset is necessary
	SORTED:"frodo.arrayCollection.dataChanged.sorted",//indicates that the data has been sorted
	
	init:function(d) {
		//need to check to make sure d is an array!
		if(d !== null && d !== undefined && d.push !== undefined) {
				this.data = d.slice(0);//create a copy!
		} else {
			this.data = [];
		}
		this.sorts = [];
		this.autoSort = false;
		this._uniqueID = 0;
		this._super();
	},
	
	
	//if unique, addItem will only add the item once
	// TODO: adjust to use addItemAt
	addItem:function(item, unique) {
		if (unique) {
			for(var i=0; i<this.getLength(); i++) {
				if(this.getItemAt(i) == item) {
					return i;
				}
			}
		}
		//if we get here, the item is unique and can be added.
		this.data.push(item);
		this._dispatchChange(this.ADD, item, this.data.length - 1);
		
		// listen for an event on the vo itself
		if ( item instanceof VO ) {
			item.removeEventListener(item.CHANGED, this._onItemChanged, this);
			item.addEventListener(item.CHANGED, this._onItemChanged, this);
		}
		return this.data.length - 1;
	},
	
	removeItem:function(item) {
		var id = this.indexOf(item);
		if (id != -1) {
			this.removeItemAt(id);
			//this._dispatchChange(this.REMOVE, item, index);
		}
		if ( item instanceof VO ) {
			var t = this;
			item.removeEventListener(item.CHANGED, this._onItemChanged, this);
		}
	},
	
	addItemAt:function(item, index) {
		this.data.splice(index,0,item);
		this._dispatchChange(this.ADD, item, index);
	},
	
	removeItemAt:function(index) {
		var item = this.data[index];
		this.data.splice(index,1);
		this._dispatchChange(this.REMOVE, item, index);
	},
	
	getItemAt:function(index) {
		return this.data[index];
	},
	/*
	getItemIndex:function(item) {
		for(var i=0; i<this.data.length; i++) {
			if(this.data[i] == item){
				return i;
			}
		}
		return -1;	
	},
	*/
	removeAll:function() {
		this.data = [];
		this._dispatchChange(this.RESET);
	},
	
	setItemAt:function(item, index) {
		this.data[index] = item;
		this._dispatchChange(this.UPDATE, item, index);
	},
	
	toArray:function() {
		return this.data;
	},
	
	setCollection:function(a,announce) {
		
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
		//no need for this first event
		//this.dispatchEvent(this.RESET, {type:this.RESET, item:this, index:null}, false);
		this._dispatchChange(this.RESET);
	},
	
	contains:function(item) {
		return (this.data.indexOf(item) > -1);
	},
	
	indexOf:function(item) {
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
		var ac = this.data.slice(0);
		return new ArrayCollection(ac);
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
		this._sortInterval = setTimeout(function() {t._doSort();}, 200);
	},
	
	_doSort:function() {
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
			this._dispatchChange(this.SORTED, null, null);
		} else {
			//console.log("no changed dispatched. data didn't change?", d, this.data);
		}
	},
	
	removeSortFunction:function(sortID) {
		this.sorts.splice(sortID, 1);
	},
	
	/** Private **/
	_onItemChanged: function (event) {
		this._dispatchChange(this.UPDATE, event.context.data, this.data.indexOf(event.context.data));
	},
	
	_dispatchChange:function(kind, item, index) {
		//this.debug("dispatching a change!", kind, item, index, this.eventListeners);
		this.dispatchEvent(this.DATA_CHANGED, {type:kind, item:item, index:index}, false);
	}
	
});
