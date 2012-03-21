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
		if(dp instanceof ArrayCollection) {
			this._super(dp.data);
			this.dp = dp;
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
				//TODO: a bit of a hack, but the expression created above will end in &&..
				this._expression +="true";
				this.debug("what's the expression?:", this._expression);
				this.filterFunction = function(item) {
					this.debug("testing item:", item);
					if(eval(this._expression)){
						return true;
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
			
			// use a Processor instead of looping!
			var _processItem = function(item) {
				//this.debug("processing an item:", item);
				if( item !== undefined && ! this.filterFunction(item)  ) {
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
				var processor = new Processor(this.data, _processItem, this);
				processor.addEventListener(processor.COMPLETE, _onProcessingComplete, this );
				this.processing = true;
				processor.run();
			}
		}
	},
	
	_onTargetChange:function(event) {
		this.debug("got change:", event.context.type);
		//if add, remove or update....
		
		if(event.context.type == this.ADD) {
			if(this.filterFunction(event.context.item)) {
				this.addItem(event.context.item, true);
			}
		} else if(event.context.type == this.REMOVE) {
			this.removeItemAt(event.context.index);
		} else if(event.context.type == this.UPDATE) {
			this.debug("handling an update:", event.context);
			if(this.filterFunction(event.context.item)) {
				//if we have this item we can update it, otherwise
				// we should add it.
				this.debug("update. item passes filter:", event.context);
				if(this.contains(event.context.item)){
					this.debug("item exists: updating", event.context, this.contains(event.context.item));
					this.setItemAt(event.context.item, this.indexOf(event.context.item));
					
				} else {
					this.debug("item does not exist: adding!", event.context, this.contains(event.context.item));
					this.addItem(event.context.item);
				}
			} else {
				this.debug("item does NOT pass filter. removing", event.context);
				this.removeItemAt(event.context.index);
			}
		} else if(event.context.type == this.SORTED) {
			//we really shouldn't do anything if our original data is sorted.
			/*
			//if type == SORT.. copy the original's sort functions
			//to our own and apply our own sort?
			var len = this.getLength()-1;
			for(var i=len;i>=0; i--) {
				if( ! this.filterFunction(this.getItemAt(i))) {
					this.removeItemAt(i);
				} 
			}
			
			//We also need to check to see if an item has changed that we need to add?
			for(var a=0;a<this.dp.getLength();a++) {
				if(this.filterFunction(this.dp.getItemAt(a))) {
					this.addItem(this.dp.getItemAt(a), true);//add unique
				}
			}
			
			//this._sorts = this.dp._sorts;
			this.doSort();
			*/
		} else if(event.context.type == this.RESET) {
			this.debug("handling a reset.");
			// use a Processor instead of looping!
			var _processItem = function(item) {
				//this.debug("processing an item:", item);
				if( item !== undefined && ! this.filterFunction(item)  ) {
					this.removeItem(item);//a bit costly. it would be nice to get an index here as well and use removeItemAt
				} else {
					this.addItem(item);
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
		}else {
			this.error("handling unknown event type:", event.context);
		}
	},
	
	destroy:function() {
		this.dp.removeEventListener(this.DATA_CHANGED, this._onTargetChange, this);
		this._super();
	}
});