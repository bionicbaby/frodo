/**
 * FilteredArrayCollection. listens to another ArrayCollection with changes
 * and populates itself with that collections data based on a filter function.
 * filterFunction example: function(item, prop, value) { if(item["prop"] == value) {return true;} return false;};
 */
var FilteredArrayCollection = ArrayCollection.extend(/** @lends FilteredArrayCollection.prototype **/{
	
	name:"FilteredArrayCollection",
	//debugEnabled:true,
	
	expression:true,//the expression to use in our default filterFunction
	processing:false,//whether or not we're already processing...
	filterFunction:function(item) {return true;},
	dp:null,
	
	init:function(dp, filterMap) {
		this.debug("created an FAC with data:", dp.data.slice(0));
		//TODO: handle key! if supplied, pass to original ac and use here,
		// OR should we not pass it here?
		if(dp instanceof ArrayCollection) {
			this._super([], dp._key);
			this.dp = dp;
			this._key = this.dp._key;
			this.dp.addEventListener(dp.DATA_CHANGED, this._onTargetChange, this);
		} else {
			this.error("dataProvider supplied is not an ArrayCollection : ", arguments);
		}
		
		this.setFilter(filterMap);
	},
	
	setFilter:function(filterMap) {

		var shouldFilter = false;
		
		if(!this.processing) {
			//go ahead and set the filter!

			if(typeof filterMap == "function") {
				//if a function is passed, use that for the filterfunction
				this.filterFunction = filterMap;
				shouldFilter = true;
				
			} else if(typeof filterMap == "string") {
				//if a string is passed, assume we want to compare it to each item directly.
				this.filterFunction = function(item) {
					if((String(item).indexOf(filterMap) > -1) || filterMap =="*"){
						return true;
					} return false;
				};
				shouldFilter = true;
			} else if(typeof filterMap == "object") {
				//filterMap is an object. loop through the properties
				//of the object and create conditionals..?how do deal with ||?
				this.debug("dealing with an object...")
				this._expression = "";
				shouldFilter = true;
				for(var i in filterMap) {
					if(filterMap[i] instanceof RegExp) {
						//this._expression+=" item."+i+""
						this.debug("regexp not supported yet in filterMap");
					} else if(typeof filterMap[i] == "string") {
						//string, see if it exists
						this._expression += " ( item."+i+".indexOf( '"+filterMap[i]+"' ) > -1 ) &&";
					} else if( typeof filterMap[i] == "number" || typeof filterMap[i] == "boolean") {
						//numbers.direct comparison
						this._expression += " ( item."+i+" == "+filterMap[i]+" ) &&";
					} else if( typeof filterMap[i] == "object" ) {
					
						//hmm...
						//we need to use recursion to handle every nested object
						//aka.. createExpFromObject(object);
						this.debug("nested objects not supported in filterMap");
					}
				}
				//JR: a bit of a hack, but the expression created above will end in &&..
				this._expression +=" true";
				this.debug("what's the expression?:", this._expression);
				this.filterFunction = function(item) {
					if(item !== undefined) {
					this.debug("testing item:", item, this._expression);
						if(eval(this._expression)){
							return true;
						}
					} else {
						this.error(this, "item is undefined??", item);//item is undefined?
						//console.trace();
					}
					return false;
				}
			}
		} else {
			//if we're in the middle of processing
			//we want to listen for processing to complete
			//before changing the filterfunction..?
		}
		if(shouldFilter) {
			//JR:
			this.debug("SHOULD FILTER!", this.dp.data.length);
			
			// use a Processor instead of looping!
			var _processItem = function(item) {
				//this.debug("processing an item:", item);
				if( this.filterFunction(item)) {
					this.debug("item passes filter. adding:", item);
					this.addItem(item);
				} else {
					this.debug("item does NOT pass filter:", item);
					//no need to remove here, since we're processing our target data, and not our own data.
				}
			};
			for(var i=0; i<this.dp.data.length;i++) {
				_processItem.call(this, this.dp.data[i]);
			}
			/*
			var _onProcessingComplete = function(event) {
				this.debug("done processing!", this.getLength());
				this.processing = false;
				var p = event.context.processor;
				p.removeEventListener(processor.COMPLETE, _onProcessingComplete, this );
				p.destroy();
			};
			
			if(this.dp.getLength() > 0) {
				
				var processor = new Processor(this.dp.data, _processItem, this);
				processor.addEventListener(processor.COMPLETE, _onProcessingComplete, this );
				this.processing = true;
				processor.run();
			}
			*/
		}
	},
	
	//Override setItemAt
	setItemAt:function(item, index) {
		this.debug("setItemAt called:", item, index);
		this.data[index] = item;
		
		if(this._key !== null) {
			this._table[item[this._key]] = index;
		}
		//original dispatches an UPDATE event here.
	},
	
	//handle our target data changing
	_onTargetChange:function(event) {
		
		//if add, remove or update....
		var newItem = event.context.item;
		var type = event.context.type;
		var existingIndex = this.indexOf(newItem);
		this.debug("got change:", event.context.type, "existing index:", existingIndex);
		if(type == this.ADD) {
			if(this.filterFunction(newItem) && existingIndex == -1) {
				this.addItem(newItem);
			}
		} else if(type == this.REMOVE) {
			this.removeItemAt(existingIndex);
		} else if(type == this.UPDATE) {
			this.debug("handling an update:", newItem);
			if(this.filterFunction(newItem)) {
				//if we have this item we can update it, otherwise
				// we should add it.
				this.debug("update. item passes filter:", newItem);
				if(existingIndex > -1){
					this.debug("item exists: updating..", newItem === this.getItemAt(existingIndex));
					if(newItem != this.getItemAt(existingIndex)) {
						this.debug("new item does NOT match existing item. calling setItemAt");
						this.setItemAt(newItem, existingIndex);
					}
					
				} else {
					this.debug("item does not exist: ADDING!", newItem);
					this.addItem(newItem, true);
				}
			} else {
				this.debug("item does NOT pass filter. removing", newItem);
				if(existingIndex>-1) {
					this.removeItemAt(existingIndex);
				} else{
					this.removeItem(newItem);
				} 
			}
		} else if(type == this.RESET) {
			this.debug("HANDLING a reset.");
			
			
			var len = this.dp.data.length;
			
			for(var i=len-1; i>0; i--) {
				var item = this.dp.data[i];
				//if(item !== undefined) {//this should never occur??
					if(this.filterFunction(item)) {
						this.addItem(item, true);
					} else {
						this.removeItem(item);
					}
				//}
			}
			
			/*
			// use a Processor instead of looping! TODO: Modify processor to handle reverse processing..
			var _processItem = function(item) {
				//this.debug("processing an item:", item);
				if( this.filterFunction(item)  ) {
					this.addItem(item);
				} else {
					this.removeItem(item);//a bit costly. it would be nice to get an index here as well and use removeItemAt
				}
			};
			var _onProcessingComplete = function(event) {
				this.debug("done processing!", this.getLength());
				this.processing = false;
				var p = event.context.processor;
				p.removeEventListener(processor.COMPLETE, _onProcessingComplete, this );
				p.destroy();
			};
			if(this.dp.getLength() > 0) {
				var processor = new Processor(this.dp.data, _processItem, this);
				processor.addEventListener(processor.COMPLETE, _onProcessingComplete, this );
				this.processing = true;
				processor.run();
				
			}
			*/
		}else {
			this.error(this, "handling unknown event type:", event.context);
		}
	},
	

	_onItemChanged: function (event) {
		//
		this.debug("ITEM CHANGED IN FILTERED AC:", event);
		//JR: filteredAC's need to know more about this type of update event... but what do we actually need to know?
		if(this.filterFunction(event.context.data)) {
			//this._dispatchChange(this.ADD, event.context.data, this.indexOf(event.context.data));
			this.addItem(event.context.data, true);
		} else {
			//this._dispatchChange(this.REMOVE, event.context.data, this.indexOf(event.context.data));
			this.removeItem(event.context.data);
		}
		//dispatch an update event?
		this._dispatchChange(this.UPDATE);
	},
	
	
	clearFilter:function() {
		//reset our expression, remove all of our data?
		this._expression = true;
		
	},
	
	destroy:function() {
		this.dp.removeEventListener(this.DATA_CHANGED, this._onTargetChange, this);
		this._super();
	}
});