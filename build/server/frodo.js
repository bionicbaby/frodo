/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();
/**
 * 
 */

var ConsoleLogger = Class.extend({
	
	prefix: null,
	
	init: function (prefix) {
		this.prefix = prefix;
	},
	
	debug: function () {
		console.log( this.prefix, arguments);
	},
	
	error: function () {
		console.error( this.prefix, arguments);
	},
	
	info: function () {
		console.info( this.prefix, arguments);
	},
	
	fatal: function () {
		console.error( " !! FATAL !! " + this.prefix, arguments);
	}
	
});/**
 * 
 */

var Log = Class.extend({
	
	/**
	 * @description the logger class itself, this is used to log in different and interesting ways.  For now just defaulting to a console, in future we could use this to log to a server as needed
	 * @version not implemented
	 */
	_logger: null,
	
	/**
	 * @constructs
	 */
	init: function ( prefix, logger  ) {
		if ( logger === undefined && this._logger == null ) {
			this._logger = new ConsoleLogger(prefix);
		}
	},
	
	/**
	 * @description log a basic message
	 */
	debug: function () {
		this._logger.debug.apply(this._logger.debug, arguments);
		//this._logger.debug(arguments);
	},
	
	/**
	 * @description log an error message
	 */

	error: function () {
		this._logger.error.apply(this._logger.error, arguments);
		//this._logger.error(arguments);
	},
	
	/**
	 * @description log an info message
	 */
	info: function () {
		this._logger.info.apply(this._logger.info, arguments);
		//this._logger.info(arguments);
	},
	
	/**
	 * @description log a fatal error message
	 */
	fatal: function () {
		this._logger.fatal(arguments);
	}
	
});

Log.prototype.DEBUG = "debug";
Log.prototype.WARN = "warn";
Log.prototype.ERROR = "error";
Log.prototype.FATAL = "FATAL";


	/** @class BaseClass
	 * @extends Class
	 */
	
	BaseClass = Class.extend(/** @lends BaseClass.prototype */{
		
		/** @public
		 * @description The name for this class.
		 */
		name:"BaseClass",
		
		/**
		 * @public
		 * @description the instanceId
		 */
		instanceId:"__defInst__",
		
		/**@private
		 * @description unique timestamp
		 */
		_renderTime:null,
		
		/**@private
		 * @description the log container
		 */

		_log: null,
		
		/** 
		 * @constructs 
		 **/
		init:function( window, jQuery, Settings, undefined ) {
			
			this._renderTime = new Date().getTime();
			this.instanceId = this.name+"_"+ this._renderTime;
			
			//add displayName to all of our functions.
			//used in EventDispatcher for GC, and general
			//debugging in webkit browsers.
			for(var i in this) {
				if(typeof this[i] == "function") {
					this[i].displayName = this.name+"."+i;
				}
			}

			console.log( this.name );
			// create logger for the individual class.. each class gets its own to make life easier...
			this._log = new Log(this.instanceId+":"+this.name);
		},
		
		/**
		 * @public
		 * @description provides an interface to the console.error function
		 */
		error:function() {
			this._log.error(arguments);
		},
		
		/**
		 * @public
		 * @description provides an interface to the console.log function
		 */
		debug:function() {
			this._log.debug(arguments);
		},
		
		/**
		 * @public
		 * @description provides an interface to the console.info function
		 */
		info:function() {
			this._log.info(arguments);
		},
		
		/**
		 * @public
		 * @description provides an interface to a fatal error
		 */
		fatal:function() {
			this._log.fatal(arguments);
		},
		
		/**
		 * @public
		 * @description provides an interface to retrieve the logger class itself
		 */
		getLogger:function() {
			this._log;
		},
		
		/**
		 * @description destroys this class instance.
		 */
		destroy:function() {
			for(var i in this) {
				delete this[i];
			}
		},
		
		valid: function ( param, type ) {
			// check the type of the param
			if ( param instanceof type ) {
				// if the param is of the right type and there is a valid method on the param itself lets go ahead and validate that
				if ( typeof param.valid == "function" ) {
					param.valid();
				} 
			} else {
				if ( typeof param.name != "undefined" ) {
				throw("The param provided was of the wrong type.  The value passed was " + typeof param + " when the expected type was " + param.name);
				} else {
					throw("The param provided was of the wrong type."+typeof param);
				}
			}
		}
		
	});
		
/** @class EventDispatcher
 * @extends BaseClass
 */
var EventDispatcher = BaseClass.extend(/**@lends EventDispatcher.prototype */{
	
	name:"EventDispatcher",
	eventListeners:{},

	/** @constructs **/
	init:function( window, jQuery, Settings, undefined  ){
		this._super( window, jQuery, Settings, undefined );
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
			throw "ERROR adding event listener for event:";
			
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
/** UPBaseEvent.js
 * 
 *  base class for all JS Events
 *   
 **/

var Event = Class.extend({
	
	data:{},
	dataClass:VO,
	name:"Event",
	origin:null,
	
	init: function (type,dataObject) {
		this.data = new VO();
		if (typeof dataObject != "undefined") {
			this.data.setValues(dataObject);
		}
		// store origin information about what window the event was created in so we can reference back as needed.
		this.origin = {};
		this.origin.location = window.location.href;
		this.origin.window = window.self;
		if ( typeof window.name !== "undefined") {this.origin.name = window.name; } else { this.origin.name = "parent"; }
	
		this.validate();
	},
	
	validate: function () {
		throw "EVENT_VALIDATE_MISSING";
	}
	
	
});
/**
 * ClickHandler
 * 
 * description: A wrapper for click events. IE8 triggers an onBeforeUnload event
 * whenever a javascript href is clicked. We use event.preventDefault() to keep
 * this from happening.
 * 
 * @param {Object} owner
 * @param {Object} button
 * @param {Object} handler
 */

var Proxy = function ( scope, callback ) {
    return function () { callback.apply( scope, arguments ); }
}

module.exports = Proxy;

	/** @class Service
	 * @extends BaseClass
	 * @description Services are the primary container you will use to write your business rules and
	 * @description and logic for non visual components.  While this layer represents your primary code base, it is
	 * @description not intended to be opened up to the browser for public consumption.  Think of this as your private
	 * @description logic layer.
	 * @see Service
	 */
	
	var Service = BaseClass.extend(/** @lends Service.prototype */{
		
		/** @public
		 * @description The name for this class.
		 */
		name:"Service"	
			
	});
		
/**
 *  Factory
 **/

var Factory = EventDispatcher.extend({
	
	name: "Factory",
	
	init: function (type) {
		this.type = type;
		this.cache = new HashTable();
		this._super();
	},
	
	get: function (key) { 
		return this.cache.get(key);
	},
	
	has:function(key) {
		var item = null;
		item  = this.cache.get(key);
		if(typeof item != "undefined" && item !== null) {
			return true;
		} else {
			return false;
		}
	},
	
	set: function( key, value) {
		this.cache.set(key,value);
	},
	
	remove: function( key) {
		this.cache.remove(key);
	},
	
	create: function( instance, config ) {
		var o = new instance(config);
		// take the name of the class and automatically set it in the cache
		this.set( o.name, o); 
		return o;
	},
		
	getData: function () {
		return this.cache;
	}
	
});
/**
 *  Factory
 **/

var SingletonFactory = Factory.extend({
	
	name: "SingletonFactory",
	
	SINGLETON_EXCEPTION: "SingletonException",
	
	set: function (key,value) {
		// The service factory should instantiate singletons...
		if ( this.has(key) ) {
			throw this.SINGLETON_EXCEPTION;
		} else {
			this._super(key,value);
		}
	}

});

	var ServiceFactory = SingletonFactory.extend({
		
		name: "ServiceFactory",
		
		init: function (config) {
			this._super(Service);
			this.config = config;
		},
		
		create: function (svc) {
			this._super(svc,this.config);
		}
		
	});/** Command.js
 * base class for all commands
 * all commands should override the execute function
 */

var Command = BaseClass.extend({
	name:"Command",
	execute:function(event) {}
});

	var Cache = BaseClass.extend({
		name:"Cache",
		localstorage: false,
		sessionstorage: false,
		CLEAR: "winston.core.clearCache",
		_local:{},//local copy of our cache.
		
		init: function (cacheName,timeout) {
			
			this.localstorage = (typeof  window.localStorage == "undefined" ) ? false : true;
			this.sessionstorage = (typeof  window.sessionStorage == "undefined") ? false : true;
			
			this._local = {};
			this.cacheName = cacheName;
			this._super();
		},
	
		getItem: function(key) {
			if(this._local[key] !== undefined && this._local[key] !== null ) {
				return this._local[key];
			} else {
				this._local[key] = this.collection[this.getCacheKey(key)];
			}
			
			return this._local[key];//this.collection[this.getCacheKey(key)];
		},
		
		setItem: function(key,obj) {
			this._local[key] = null;
			this.collection[this.getCacheKey(key)] = obj;
		},
		
		has: function (key) {
			if ( typeof this.getItem(this.getCacheKey(key)) !== "undefined" )
			{
				return true;
			}
			return false;
		},
		
		removeItem: function (key) {
			delete this.collection[this.getCacheKey(key)];
		},
		
		getCacheKey: function (key) {
			return this.cacheName + "_" +  key;
		},
		
		clear: function () {
		}
		
	});
/**
 * VO class
 * TODO: Create an 'instance' property to store all of our 'public' properties.
 * return this in stringify.
 */

var VO = EventDispatcher.extend({
	
	__type__: "VO",
	name: "VO",
	_dispatchInterval:null,
	renderClass: null,
	
	//Events
	CHANGED:"sdk.vo.changed",
	
	property: {},
	
	init: function () {
		this._super();
		this._dispatchInterval=null;
	},
	
	get : function (key) {
		return this[key];
	},
	
	set: function (key,val) {
		//this.debug("Setting VO property",key,val); 
		var dirty = false;

		// dont update if the value is the same
		if ( this[key] != val ) {
			this[key] = val;
			dirty = true;
		}
		
		// dispatch changed event
		if ( dirty ) {
			this._dispatchEvent(this.CHANGED, 
			{data:this, key:key, value:val}, 
			false);
		}
	},
	
	triggerChange: function() {
		// dispatch changed event
		this._dispatchEvent(this.CHANGED, 
		{data:this, key:null, value:null}, 
		false);
	},
	
	setValues: function(object) {
		// only call this if the change is indeed founded		
		if ( this.equals(object) ) {
			//TODO: extend causes really weird scope issues...
			// I know Matt hates loops, but I'm gonna go out on a limb
			// here and assume even tho this is a one line function call,
			// that internally, it's looping like a mofo anyway, as well
			// as doing some other wacky shit we don't need or want.
			//$.extend( true, this, object );
			for(var i in object) {
			//if we find we're losing events down the line,
			//  change this to this.set(i, object[i]);
				this[i] = object[i];
			}
			this._dispatchEvent(this.CHANGED, {
				data: this
			}, false);
		}
	},
	
	getSerializableData: function () {
		var temp = {};
		if ( this["__type__"] !== undefined ) {
			temp["__type__"] = this.__type__;
		}
		return temp;
	},
			
	stringify:function() {
		var temp = this.getSerializableData();
		return JSON.stringify(temp);
	},
	
	equals: function (object) {
		return true;
	},
	
	_dispatchEvent:function() {
		return this.dispatchEvent.apply(this,arguments);
	}
});
/**
 * VO class
 * TODO: Create an 'instance' property to store all of our 'public' properties.
 * return this in stringify.
 */

var SerializableVO = VO.extend({
	
	__type__: "SerializableVO",
	name: "SerializableVO",
	
	getSerializableData: function () {
		var temp = this._super();
		return temp;
	},
			
	stringify:function() {
		var temp = this.getSerializableData();
		return JSON.stringify(temp);
	}
		
});
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
		
		this.debug("hashTable.set",key,value)
		
		// get our fancy pants on and improve performance
		var array = this.array;
		var index = this.index;
		var hashKey = this.getHashKey(key);
		
		this.debug("checkin on key",this.get( key ));
		
		// handle update or add
		if ( this.get( key ) ) {
			
			this.debug("key exists updating...",value);
			
			// update array and maps objects
			// because we don't loop here we use the index table instead we now have 
			// access to the objects in an iterator by key rather than looping
			array[ index[hashKey] ] = value;
			
			// we are updating
			this._dispatchChange(this.UPDATE, data );
		} else {
			
			this.debug("key does not existing, adding item",value);
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
			this.debug("key does not exist... returning null");
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
	DATA_CHANGED: "winston.arrayCollection.dataChanged",
	
	//sub-types for our events
	ADD:"winston.arrayCollection.dataChanged.add",//indicates that an item (or items) have been added
	REMOVE:"winston.arrayCollection.dataChanged.remove",//indicates that an item (or items) have been removed
	REPLACE:"winston.arrayCollection.dataChanged.replace",//indicates an item has been replaced
	UPDATE:"winston.arrayCollection.dataChanged.update",//indicates an item has been updated/changed
	RESET:"winston.arrayCollection.dataChanged.reset",//indicates that so much has changed, that a complete reset is necessary
	SORTED:"winston.arrayCollection.dataChanged.sorted",//indicates that the data has been sorted
	
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
		var b = this.data.slice(index, this.data.length);
		this.data.push(item);
		this.data.concat(b);
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
var PersistentArrayCollection = ArrayCollection.extend({
	
	name:"PersistentArrayCollection",
	//debugEnabled:true,
	cacheName:"",
	cache:null,
	
	init:function( d, cache, cacheName ) {
		this.cache = cache;
		if (cache !== null) {
			this.cacheName = ( cacheName !== null && cacheName !== undefined ) ? cacheName : cache.cacheName;
			this._super(d);
			// call inside a timeout so people have an opportunity to bind to the reset
			var t = this;
			setTimeout( function() { t.restoreFromCache()}, 5 );
		} else {
			this.error("Alert: Persistent Cache created without proper cache data:", arguments);
		}
		
	},
	
	_dispatchChange:function(kind, item, index) {
		this._super(kind, item, index);
		this.updateCache();
	},
	
	updateCache:function() {
		console.log("Updating ArrayCollectionCache",this.getLength());
		this.cache.setItem(this.cacheName, this);
	},
	
	restoreFromCache:function() {
		
		console.log("Restoring from cache");
		var useSimpleData = false;
		var cacheData = this.cache.getItem(this.cacheName);
		
		//console.log("restoring from cache",cacheData);
		
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
						//TODO: somehow, this screws up the scope
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


/**
 *  Iterator
 **/

var Iterator = BaseClass.extend({
	
	/**
     * Nothing is a class that represents nothing
     * @constructor
     */
	
	NO_ELEMENT_EXCEPTION: "NoSuchElementException",
	
	init: function (data) {
		this.debug("constructing iterator");
		this.data = data;
		this.index = 0;
		this._super();
	},
	
	hasNext: function () {
		var result = this.index < this.data.length;
		return result;
	},
	
	next: function () {
		if ( this.hasNext() ) {
			this.index++;
		} else {
			throw( this.NO_ELEMENT_EXCEPTION );
		}
	},
	
	prev: function () {
		this.index--;
	},
	
	current: function () {
		return this.data[this.index];
	},
	
	array: function () {
		return this.data;
	}
	
});module.exports.Class = Class;
module.exports.BaseClass = BaseClass;
module.exports.Cache = Cache;
module.exports.ArrayCollection = ArrayCollection;
module.exports.HashTable = HashTable;
module.exports.Model = Model;
module.exports.VO = VO;
module.exports.SerializableVO = SerializableVO;
module.exports.Event = Event;
module.exports.Proxy = Proxy;
module.exports.EventDispatcher = EventDispatcher;
module.exports.Command = Command;
module.exports.Factory = Factory;
module.exports.SingletonFactory = SingletonFactory;
module.exports.ServiceFactory = ServiceFactory;