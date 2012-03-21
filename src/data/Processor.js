/**
 * @description processes a large array in timed chunks
 * inspired by http://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/
 */
Processor = EventDispatcher.extend({
	
	name:"Processor",
	//debugEnabled:true,
	
	_items:null,
	_process:null,
	_context:null,
	_start:0,
	
	/** Events */
	/**
	 * @event complete
	 * @description signifies that processing has finished. 
	 */
	COMPLETE:"sdk.data.processor.complete",
	
	init:function(items, process, context) {
		this._super();
		this._items = items;//items to process
		this._process = process;//method supplied to process the item
		this._context = context;//context in which to call the process method
		this._stop = false;//flag to stop in the middle of processing
		//this.process(this._items, this._process, this._context, this.complete);
	},
	
	/** Public **/
	run:function() {
		this._start = new Date().getTime();
		if(this._items.length > 0) {
			this.process(this._items, this._process, this._context, this._onComplete);
		} else {
			this._onComplete();
		}
	},
	
	reset:function() {
		this.debug("reset: UNIMPLEMENTED");
	},
	
	//stops processing!
	stop:function() {
		this._stop = true;
	},
	/** Private **/
	//start processing
	process:function(items, process, context, callback) {
		//Copyright 2009 Nicholas C. Zakas. All rights reserved.
		//MIT Licensed
		var todo = items.slice(0);   //create a clone of the original
		var t = this;
	    setTimeout(function(){

	        var start = +new Date();

	        do {
	            var item = todo.shift();
	           if(item !== undefined) {//this is weird. if an empty array is passed, this returns undefined??
	            	process.call(context, item);
	            }
	        } while (todo.length > 0 && (+new Date() - start < 50) && ! t._stop);

	        if (todo.length > 0){
	            setTimeout(arguments.callee, 25);
	        } else {
	            callback.call(t,items);
	        }
	    }, 25);
	},
	
	//callback for process completion
	_onComplete:function() {
		this.debug("processed "+this._items.length+" items in "+ (new Date().getTime() - this._start)/1000 + " seconds");
		this.dispatchEvent(this.COMPLETE, {processor:this}, false);
	}
});


