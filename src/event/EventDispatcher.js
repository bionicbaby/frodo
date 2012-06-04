/** @class EventDispatcher
 * @extends BaseClass
 */
var EventDispatcher = BaseClass.extend(/**@lends EventDispatcher.prototype */{
	
	name:"EventDispatcher",
	eventListeners:{},

	/** @constructs **/
	init:function(){
		this._super();
		this.eventListeners = {};
		
		// run GC every 15 seconds
		var t = this;
		setInterval( t._gc, 15*1000 );
	},
	
	/**
	 * @public addEventListener
	 * @param {Object} eventName
	 * @param {Object} handler
	 * @param {Object} obj
	 * @param {Object} priority
	 */
	
	addEventListener:function(eventName, handler, obj, priority) {
		var l = this.eventListeners[eventName];
		if(typeof l == "undefined") {
			l = [];
		}
		//TODO: When going cross-window, in IE, typeof handler is going to be object
		// instead of function. 
		if ( obj === undefined) {
			obj = {};
		}
		if ( (!framework.MSIE) && typeof handler == "function" && typeof obj == "object" || (framework.MSIE) && (typeof handler=="object" || typeof handler=="function") && typeof obj == "object") {
			if (priority) {
				l.unshift({
					handler: handler,
					obj: obj
				});
			}
			else {
				l.push({
					handler: handler,
					obj: obj
				});
			}
			this.eventListeners[eventName] = l;
		} else {
			//this.debug( eventName, handler, obj );
			throw "ERROR adding event listener for event: " + eventName;
			
		}
	},
	/**
	 * @public removeEventListener
	 * @param {Object} eventName
	 * @param {Object} handler
	 * @param {Object} obj
	 */
	removeEventListener:function(eventName, handler, obj) {
	
		var l = this.eventListeners[eventName];
		if(typeof l != "undefined") {
			//TODO: reverse this loop since we're removing items..
			for(var i=0; i<l.length; i++) {
				if( (l[i].handler == handler) && (l[i].obj == obj) ){
					l.splice(i,1);
					//normally we'd break here, but let's let the loop run
					//in case some monkey added their listener multiple times.
				}
			}
		}
		this.eventListeners[eventName] = l;
	},
	
	/**
	 * 
	 * @param {Object} eventName
	 * @param {Object} data
	 * @param {Object} bubble
	 * @param {Object} modernEvent
	 * @param {Object} retry
	 */
	dispatchEvent:function( eventName, data ) {
		
		//run Garbage collection before dispatching
		//this._gc();
		// bit aggressive no?
		
		// setup a nice dynamic number for the eventID
		var eventID = new Date().getTime() + "_" + String(( Math.random()*10000 ).toFixed());
		
		// make the new modern events flash safe
		var event = {};
			event.eventName = eventName;
			event.name = data.name;
			event.context = data.data;
			if ( event.context === undefined ) {
				event.context = data;
			}
		
		//broadcast to listeners
		var l = this.eventListeners[eventName];
		if(l !== undefined) {
			// loop over event listeners and execute
			for(var i=0; i<l.length; i++) {	
				//nice debugging
				/*if(this.debugEnabled && !framework.MSIE){
					console.group(this.name+" dispatching :"+eventName, this, "on:", l[i], " with event:", event);
				}*/
				//call the method on the object
				l[i].handler.call(l[i].obj, event);
				//end the group
				/*if(this.debugEnabled && !framework.MSIE){
					console.groupEnd();
				}*/
			}
		}
	},
	
	addCommand : function(eventName, command, priority) {
		try {
			var c = new command();
			this.addEventListener(eventName, c.execute, c, priority);
		}catch(e){
			this.error("ERROR addCommand failed.",e);
		}
	},
	
	//cleanup any broken event listener references
	//TODO: Optimize by passing an optional event name
	// so we don't have to check EVERY event each time.
	_gc:function(eName) {
			
		if(eName !== undefined && eName !== null) {
			var ea = this.eventListeners[eName];
			if(ea !== undefined) {
				for(var i=ea.length-1; i>=0; i--) {
					var item = ea[i];
					// if we're dealing with an anonymous function, ignore.
					if(item.handler.displayName != undefined) {
						if(item.obj[String(item.handler.displayName.split(".")[1])] == undefined) {
							//this.debug( item, this.name );
							 throw "found a broken listener for event: "+a+" removing.";
							ea.splice(i,1);
						}
					}
				}
			}
		}
	}
	
});
