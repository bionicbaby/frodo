
(function(window,undefined){
	
	// frodo should be a singleton so if we already exist we should simply return it
	if ( window.frodo !== undefined ) {
		return;	
	}
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
var Browser = {
	
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
Browser.init();
/**
 * 
 */

var ConsoleLogger = Class.extend({
	
	prefix: null,
	
	init: function (prefix) {
		this.prefix = prefix;
	},
	
	debug: function () {
		var args = [];
		args[0] = "--" + " " + this.prefix + " -- ";
		for ( var i = 0 ; i < arguments.length ; i++ ) {
			args[i+1] = arguments[i];
		}
		console.log.apply( console, args);
	},
	
	error: function () {
		var args = [];
		args[0] = "--" + " " + this.prefix + " -- ";
		for ( var i = 0 ; i < arguments.length ; i++ ) {
			args[i+1] = arguments[i];
		}
		console.error.apply( console, args);
	},
	
	info: function () {
		var args = [];
		args[0] = "--" + " " + this.prefix + " -- ";
		for ( var i = 0 ; i < arguments.length ; i++ ) {
			args[i+1] = arguments[i];
		}
		console.info.apply( console, args);
	},
	
	fatal: function () {
		var args = [];
		args[0] = "--" + " " + this.prefix + " -- ";
		for ( var i = 0 ; i < arguments.length ; i++ ) {
			args[i+1] = arguments[i];
		}
		console.error.apply( console, args);
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
		this._logger.debug.apply(this._logger, arguments);
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

var ClickHandler = Class.extend({
	handler:null,
	owner:null,
	button:null,
	
	init:function(owner, button, handler) {
		
		this.handler = handler;
		this.owner = owner;
		this.button = button;
		// check if button is a string, if so
		// use live, other wise assume it's a dom object
		var t = this;
		var f = function(event) {
			return t.onClick(event);
		};
		if (typeof button == "string") {
			$("."+button).live("click", f);
		}
		else {
			button.click(f);
		}
	},
	
	onClick: function(event) {
		this.handler.call(this.owner, event);
		event.preventDefault();
	},
	
	destroy:function() {
		if(this.button !== undefined) {
			if (typeof this.button == "string") {
				$("." + this.button).die("click");
			}
			else {
				this.button.unbind("click");
			}
		}
		this._super();
	}
});

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
/**
 * @class
 * @description The primary framework class contains all core framework functions
 */

var Framework = EventDispatcher.extend({
	
	LOADED: "frameworkLoaded",
	
	/**
	 * @static
	 * @description Static variable for browser detection of Webkit ( Safari or Chrome )
	 */
	WEBKIT: ( Browser.browser == 'Chrome' || Browser.browser == "Safari" ) ? true : false,

	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer
	 */
	MSIE: ( Browser.browser == 'Explorer' ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer 7
	 */
	MSIE7: ( Browser.browser == 'Explorer' && Browser.version == 7 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer 8
	 */
	MSIE8: ( Browser.browser == 'Explorer' && Browser.version == 8 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer 9
	 */
	MSIE9: ( Browser.browser == 'Explorer' && Browser.version == 9 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer 10
	 */
	MSIE10: ( Browser.browser == 'Explorer' && Browser.version == 10 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Firefox 3.x
	 */
	FF3: ( Browser.browser == 'Firefox' && Browser.version == 3 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Firefox 4.x
	 */
	FF4: ( Browser.browser == 'Firefox' && Browser.version == 4 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Firefox 5 or later
	 */
	FF5plus: ( Browser.browser == 'Firefox' && Browser.version > 4 ) ? true : false,
	
	init: function (scope) {
		
		// alias publically
		scope.noConflicts = this.noConflicts;
		window.frodo = scope;
		this.dispatchEvent(this.LOADED,{scope:scope});
		
	},
	
	/**
	 * @description used to load core modules.
	 */
	loadModule: function ( name, path ) {
		
	},
	
	/**
	 * @description Used to eliminate any potential conflicts with someone else using a different version of frodo
	 */
	noConflicts: function (remove) {
		
		if ( remove ) {
			delete window.frodo;
		}
		
		// send an alias back to the caller and then remove the alias on the window.
		return scope;
	}
	
});

	var Cache = EventDispatcher.extend({
		
		name:"Cache",
		localstorage: false,
		sessionstorage: false,
		
		CLEAR: "cache.clear",
		CACHE_RESTORED: "cache.restored",
		
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
 * CookieCache Class
 * TODO: When we write to the cookie cache check
 * for flash core.swf to exist. if so, use that instead?
 * 
 **/

	var CookieCache = Cache.extend({
		
		init: function (cacheName) {
			this.date = new Date();
			this.date.setTime(this.date.getTime()+(1*24*60*60*1000));
			//this.cacheName = cacheName; // hash the cache name to keep it safe for the cache mechanism
			this._super(cacheName);
		},
	
		getItem: function(key) {
						
			//get all cookies
			var ca = document.cookie.split(";");
			for(var i=0; i<ca.length; i++) {
				var c = ca[i].split("=");
				if(c[0].trim() == key) {
					this.debug("returning item for key "+ key + " : " + c[1]);
					try {
						var res = JSON.parse(c[1]);
					} catch (e ) {
						this.error("Error parsing json from cookie", e, c[1]);						
					}
					return res;
				}
			}
			return null;
		},
		
		setItem: function(key, obj) {
			this.debug("setItem on cookie cache:", key, obj);
			var value = "";
			
			if (typeof obj.stringify != "undefined") {
				//use the object's custom stringify
				value = obj.stringify();
			}
			else {
				//generic JSON stringify
				value = JSON.stringify(obj);	
			}
			
	        var expires = "expires="+this.date.toGMTString();
			document.cookie = key+"="+value+";"+expires+"; path=/"; // we set a path so these cookies are not sent to any server anywhere
			
		},
			
		has: function (key) {
			if ( this.getItem(key) === null ) {
				return false;
			} else {
				return true;
			}
		},
		
		removeItem: function (key) {
			var date = new Date();
			date.setTime(date.getTime()-1);
			var expires = "; expires="+date.toGMTString();
			document.cookie = key+"="+''+expires+"; path=/"; // we set a path so these cookies are not sent to any server anywhere
		},
		
		
		outOfSpace: function ( e ) {
			this.error("CookieCache out of space!", e);	
		},
		
		clear: function () {
			// no real way (??)
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				this.removeItem(cookies[i].split("=")[0]);
			}
			
		}
		
	});/**
 * LocalStorageCache Class
 **/

	var LocalStorageCache = Cache.extend({
	
		init: function (cacheName) {
			this.collection = window.localStorage;
			this._super(cacheName);
		},
	
		getItem: function(key) {
			var localItem = this._local[key];
			//return the copy in local memory
			if(localItem !== null && localItem !== undefined) {
				return localItem;
			}
			//if no local mem. item found, get it from the cache
			var item = this.collection.getItem( key );
			
			if (typeof item == "string") {
				try {
					if ( item === undefined || item === null || ! String(item).length ) {
						return null;
					}
					var result = JSON.parse(item);
				}catch(e) {
					this.error("ERROR calling JSON.parse.", e, key, item);
					return null;
				}
			}
			this._local[key] = result;
			return result;
		},
		
		setItem: function(key, obj) {
			var store = this.collection;
			var strObj = "";
			//erase the local memory copy.
			this._local[key] = null;
			
			if (obj == null) {
				store.setItem(key, obj);
				return;
			}
		
			if ( obj instanceof SerializableVO || obj instanceof PersistentArrayCollection ) {
				//use the object's custom stringify
				//this.debug("using the objects stringify:",obj.stringify())
				strObj = obj.stringify();
			}
			else {
				//generic JSON stringify
				//this.debug("using JSON.stringify")
				strObj = JSON.stringify(obj);	
			}
			store.setItem(key, strObj);
			
			/*
			try {}
			catch ( e ) {

				
				// going to supress this error: "" as it does not impact storage.
				// this error only happens in FF 3.6.x near as I can tell but it does not affect things.
				if ( e.message === "Component returned failure code: 0x80630002 [nsIDOMStorage.setItem]")
				{
					// ignore this state
					sdk.debug("FF LOCALSTORAGE ERROR!! in setItem:", key, strObj);
					
				} else {
					this.error("caught an error trying to set an item:", key, obj, this.collection.getItem(key), e);
				}
			}*/
		},
		
		has: function (key) {
			if ( typeof this.getItem( key ) != "undefined" )
			{
				return true;
			}
			return false;
		},
		
		removeItem: function (key) {
			this.collection.removeItem(key);
		},
		
		error: function (e) {
			this.debug("error:", e);
			/*if ( e == QUOTA_EXCEEDED_ERR )
			{
				alert("out of space!");
				this.outOfSpace();
			}*/
			
		},
		
		outOfSpace: function ( e ) {
			
		},
		
		clear: function () {
			localStorage.clear();
		}
		
	});/**
 * SessionStorageCache Class
 **/

	var SessionStorageCache = Cache.extend({
	
		init: function (cacheName) {
			//this.debug("instantiating local storage cache");
			this.cacheName = hash(cacheName); // hash the cache name to keep it safe for the cache mechanism
			this.collection = window.sessionStorage;
			this.iterator = new SessionStorageIterator(this.collection);
			this.onChangeCallback = function (e) { /*dont do anything by default*/ };
		},
	
		getItem: function(key) {
			var item = this.collection.getItem( this.getCacheKey(key) );
			if (item != null) {
				return JSON.parse(item);
			}
			return item;
		},
		
		setItem: function(key,obj) {
			key = this.getCacheKey(key);
			
			
			try {
				//if(typeof obj != "string") {
					obj = JSON.stringify(obj);
				//}
				window.sessionStorage.setItem(key,obj);
			}
			
			catch ( e ) {

				
				// going to supress this error: "" as it does not impact storage.
				// this error only happens in FF 3.6.x near as I can tell but it does not affect things.
				if ( e.message === "Component returned failure code: 0x80630002 [nsIDOMStorage.setItem]")
				{
					// ignore this state
					
				} else {
					this.debug("caught an error trying to set an item",e, this.getCacheKey(key), obj, window.sessionStorage.getItem(key) );
				}
			}
		},
		
		has: function (key) {
			if ( typeof this.getItem(this.getCacheKey(key)) != "undefined" )
			{
				return true;
			}
			return false;
		},
		
		removeItem: function (key) {
			//this.debug("SESSION: attempting to remove item from cache",key)
			window.sessionStorage.removeItem(this.getCacheKey(key));
		},
		
		error: function (e) {
			//this.debug("error:", e);
			/*if ( e == QUOTA_EXCEEDED_ERR )
			{
				alert("out of space!");
				this.outOfSpace();
			}*/
			
		},
		
		outOfSpace: function ( e ) {
			
		},
		
		getIterator: function () {
			return this.iterator;
		}
		
	});/**
   * Cache Super Class
 **/

	var TemporaryCache = Cache.extend({
	
		CLEAR_CACHE: "clear.cache",
		
		init: function (cacheName) {
			
			// make cache site specific
			this.cacheName = cacheName;
			
			// cleanup classes inherited properties
			delete this.collection;
			
			if ( sessionStorage !== undefined ){
				// Take advantage of local storage that is persistent
				// between tabs on the same site and can store MBs of data
				this.wrapper = new SessionStorageCache(this.cacheName);
				//this.debug("TemporaryCache using SessionStorageCache");
			
				// register this cache to respond to the global clear cache command, now all persistent caches will respond to this command.
				sdk.addEventListener( this.CLEAR_CACHE, this.clear, this );
				
			} else {
			  // resort to a flash cache
			  this.wrapper = new FlashCache(this.cacheName);
			  // flash will already listen for clear_cache internally from the swf, so we dont need to do anything here for the cache clear
			  //this.debug("TemporaryCache using FlashCache");
			}
			
		},
	
		getItem: function(key) {
			return this.wrapper.getItem(key);
		},
		
		setItem: function(key,obj) {
			this.wrapper.setItem(key,obj);
		},
		
		removeItem: function (key) {
			//this.debug("TemporaryCache: removing cache",key);
			this.wrapper.removeItem(key);
		},
		
		clear: function () {
			//this.debug("clear cache called!!");
			this.getCollection().clear();
		},
		
		getCollection: function () {
			return this.wrapper.collection;
		},
		
		onChangeCallback: function (e) {
			//this.debug("data changed",e);
		}
		
	});

/**
   * Cache Super Class
 **/

	var PersistentCache = Cache.extend({
		
		name:"PersistentCache",
		
		init: function (cacheName,timeout,forceLocalStorage) {
			
			this.timeout = timeout;
			this._super(cacheName,timeout);
			
			// cleanup classes inherited properties
			delete this.collection;
			
			if ( chrome === undefined ) {
				// Take advantage of local storage that is persistent
				// between tabs on the same site and can store MBs of data
				this.wrapper = new LocalStorageCache(this.cacheName);
				
			} else {
				this.wrapper = new ChromeExtensionCache(this.cacheName);
			}
			
		},
		
		getItem: function(key) {
			var key = this.getCacheKey(key);
			return this.wrapper.getItem(key);
		},
		
		setItem: function(key,obj) {
			var key = this.getCacheKey(key);
			this.wrapper.setItem(key,obj);
		},
		
		removeItem: function (key) {
			var key = this.getCacheKey(key);
			this.wrapper.removeItem(key);
		},
		
		clear: function () {
			try {
				this.getCollection().clear();
			} catch (e) {
				this.error("error clearing collection.", e);
			}
		},
		
		getCollection: function () {
			return this.wrapper;
		},
		
		onChangeCallback: function (e) {
			//this.debug("data changed",e);
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
	__renderClass__: null,
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
	
	setRenderClass: function(renderClassName) {
		this.__renderClass__ = renderClassName;
		this.renderClass = eval(this.__renderClass__);
	},
	
	getSerializableData: function () {
		var temp = {};
		if ( this["__type__"] !== undefined ) {
			temp["__type__"] = this.__type__;
		}
		if (this["__renderClass__"] !== undefined ) {
			temp["__renderClass__"] = this.__renderClass__;
		}
		return temp;
	},
			
	stringify:function() {
		var temp = this.getSerializableData();
		return JSON.stringify(temp);
	},
	
	setSerializedData: function (data) {
		for(var a in data) {
			this[a] = data[a];
		}
		
		if (this["__renderClass__"] !== undefined && this.__renderClass__ != null) {
			this.setRenderClass(this.__renderClass__);
		}
	},
	
	destringify: function (stringData) {
		var data = JSON.parse(stringData);
		this.setSerializedData(data);	
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
						if(newObj.setSerializedData !== undefined) {
							newObj.setSerializedData(item);
						} else {
							for(var a in item) {
								newObj[a] = item[a];
							}
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
 * ConfigVO Class
 * 
 * @param {Object} containerId
 * 
 */

ConfigVO = VO.extend({

	containerId:"body",
	data:{},
	
	init: function (containerId, data) {
		this._super();
		this.set("containerId", containerId);
		this.set("data", data);
		this._super();
	}
	
});
/** @class DisplayObject
 * @extends EventDispatcher
 */ 
var DisplayObject = EventDispatcher.extend(/**@lends DisplayObject.prototype */{
 	
	name:"DisplayObject",
	
	/** @private
	 * @description the html template used to display a DisplayObject. 
	 */
	viewTemplate:"<div></div>",
	/** @private
	 * @description the css class to attach to the view. 
	 */
	viewClass:null,
	$view:null,
	viewID:"",
	height:0,
	width:0,
	visible:true,
	x:0,
	y:0,
	parentContainerID:null,
	locale: {},
	/** @constructs */
	init:function(configVO) {
		
		if(configVO) {
			this.height = configVO.height;
			this.width = configVO.width;
			if(configVO.containerId){ 
				this.parentContainerID = configVO.containerId;
			} else {
				this.debug("NO CONTAINERID, using 'body'", this);
				this.parentContainerID = "body";
			}
		}	
		this._super();
		this.draw();
		
	},
	/** @private */
	draw:function() {
		
		if (this.$view !== null) {
			this.$view.remove();
			this.$view = null;
		}
		if(this.viewTemplate) {
			this.$view = $(this.viewTemplate);
			this.$view.attr("id", this.name+"-" + ( this._renderTime - Math.floor(Math.random()* 10000000) ) );
		}
		if(this.viewClass) {
			this.$view.addClass(this.viewClass);
		}
		
		if (this.parentContainerID == "body") {
			$(this.parentContainerID).append(this.$view);
		} else {
			$("#" + this.parentContainerID).append(this.$view);
		}
		if (this.$view !== null) {
			
			//store a reference to our view's id
			this.viewID = this.$view.attr("id");
			
			// add IE specific classes so we can style against it using a className
			if ($.browser.msie) {
				this.$view.addClass("up-msie");
				/*if ($.browser.version == "7.0") {
					this.$view.addClass("up-msie-7");
				}*/
				if ($.browser.version == "8.0") {
					this.$view.addClass("up-msie-8");
				} 
				if ($.browser.version == "9.0") {
					this.$view.addClass("up-msie-9");
				}
			}
			/* TODO: I thought this would be an easy way to find
			 * the controller class instance through the browser
			 * console but it didn't turn out as easy as I thought.
			 */
			/*
			this.debug("storing a reference to our controller in data");
			//store a reference to ourselves on our view?
			this.$view.data("_controller", this);
			this.debug("stored:", this.$view.data("_controller"));
			*/
		}
		
		/*
		if (this.$view !== null) {
			if ($.browser.msie) {
				this.$view.addClass("up-msie");
				if ($.browser.version == "7.0") {
					this.$view.addClass("up-msie-7");
				}
				if ($.browser.version == "8.0") {
					this.$view.addClass("up-msie-8");
				}
			}
		}
		if (this.$view !== null) {
			//store a reference to ourselves on our view?
			this.$view.data("_controller", this);
		}
		*/
	},
	/**
	 * @function
	 * @param {string} animation (optional)
	 */
	show : function() {
		if (arguments.length == 1) {
			//most likely a string..
			switch(arguments[0]) {
				case "slow":
					this.$view.show("slow");
				break;
				case "fast":
					this.$view.show("fast");
				break;
				case "fadeIn":
					this.$view.fadeIn();
				break;
				default:
					this.$view.show(arguments);
				break;
			}
		} else if(arguments.length>1) {
			this.$view.show.apply(this.$view, arguments);
		} else {
			this.$view.show();
		}
	},
	
	/**
	 * @public
	 * @param {string} animation (optional)
	 */
	hide : function() {
		if (arguments.length == 1) {
			//most likely a string..
			switch(arguments[0]) {
				case "slow":
					this.$view.hide("slow");
				break;
				case "fast":
					this.$view.hide("fast");
				break;
				case "fadeOut":
					this.$view.fadeOut();
				break;
				default:
					this.$view.hide(arguments);
				break;
			}
		} else if(arguments.length>1) {
			//this.$view.call("hide", arguments);
			this.$view.hide.apply(this.$view, arguments);
		} else {
			this.$view.hide();
		}
	},
	
	/**
	 * @description toggles the display object's visibility
	 */
	toggle:function() {
		return this.$view.toggle();
	},
	
	/**
	 * @private
	 */
	destroy:function() {
		if (this.$view !== null && this.$view !== undefined) {
			this.$view.remove();
			this.$view = null;
		}
		this._super();
	},
	/**
	 * @param {Object} locale the locale object to use.
	 */
	setLocale:function(locale) {
		this.locale = locale;
	},
	
	/**
	 * @description
	 * @returns {Object} the locale object.
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**@public
	 * @description add and removes status css classes to the given element, based on the status
	 * of the user.
	 * @param {UserVO} userVO
	 * @param {Object} $element
	 */
	
	setStatus: function(userVO, $element) {
		if (userVO !== null && typeof userVO != "undefined") {
			$element.removeClass("up-status-blocked");
			$element.removeClass("up-status-offline");
			$element.removeClass("up-status-xa");
			$element.removeClass("up-status-away");
			$element.removeClass("up-status-dnd");
			$element.removeClass("up-status-available");
			$element.removeClass("up-status-chat");
			$element.removeClass("up-status-pending");
			
			var blocked = rosterService.isBlocked(userVO.userID);
			this.debug("Is user blocked?", userVO.userID, blocked );
			
			if ( userVO.online && !blocked ) { // && userVO.status !== "Offline"
				$element.addClass("up-status-" + String(userVO.show).toLowerCase());
			}
			else if ( userVO.pending && !blocked ) {
				$element.addClass("up-status-pending");
			}
			else if ( userVO.blocked || blocked ) {
				$element.addClass("up-status-blocked");
			}
			else {
				$element.addClass("up-status-offline");
			}
		}
	},
	
	prettyDate: function(time){
		var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);
				
		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;
				
		return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "1 hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
			day_diff == 1 && "Yesterday" ||
			day_diff < 7 && day_diff + " days ago" ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
	}
	
 });

 /** @class Component
	 * @extends BaseClass
	 * @description Component is a basic container of modular view logic.  Components small or large are visual in nature.  If you want to build something that is
	 * @description not visual in nature but needs a similiar container logic wise please see the Module class.
	 * @see Module
	 */
var Component = DisplayObject.extend(/**@lends Component.prototype */{
	
	UPDATE: "component.update",
	CREATE: "component.create",
	DESTROY: "component.destroy",
	DISPLAY: "component.display",
	
	name:"Component",
	
	//public vars
	/** @public*/
	containerTemplate : "<div id='container'></div>",
	backgroundTemplate:"<div id='background'></div>",
	loadingTemplate: null,
	contentTemplate:"<div id='content'></div>",
	disconnectedTemplate: null,
	viewTemplate:null,
	
	styles:{
		content:{},
		bg:{},
		container:{},
		loading:{}
	},
	
	containerID : "frodo-component-container",
	backgroundID : "frodo-component-background",
	loadingID : "frodo-component-loading",
	contentID : "frodo-component-content",
	disconnectedID : "frodo-component-disconnected",
	
	containerClass:"frodo-component-container",//class name for our container
	contentClass:"frodo-component-content",//class name for our content
	backgroundClass:"frodo-component-background",//class name for our background
	loadingClass:"frodo-component-loading",//class name for our loading div
	disconnectedClass:"frodo-component-disconnected",//class name for our loading div
	viewClass:null,
	hoverClass:"frodo-component-hover",// class name that appears when hovering over component
	
	showAnimation:null,
	hideAnimation:null,
	$view : null,//our entire view, starting at the container
	$contentView:null,// the view (DOM) holding our content
	$loadingView:null,//the view holding our loading content
	$bgView:null,
	parentContainerID : "",//our parent container ID
	id : "",
	loading:false,
	eventBindings:[],
	resizeProxy:null,
	fullHeight:false,
	
	hideInspector: null,
	
	//constructor
	init: function (configVO) {
		
		if (configVO != undefined) {
			this.parentContainerID = configVO.containerId;
			
			if ( configVO.contentClass !== undefined ) this.contentClass = configVO.contentClass;
			if ( configVO.containerClass !== undefined ) this.containerClass = configVO.containerClass;
			if ( configVO.backgroundClass !== undefined ) this.backgroundClass = configVO.backgroundClass;
			if ( configVO.viewClass !== undefined ) this.viewClass = configVO.viewClass;
			
			this._super(configVO);
		} else {
			this._super();
		}
		this.bindData();
		this.resizeProxy = null;
		this.bindEvents();
		this.bindCSS();
		/*
		if(this.loadingTemplate !== undefined && this.loadingTemplate !== null) {
			this.setLoading(this.loading);
		}
		*/
		//dispatch a component_created event
		var t = this;
		setTimeout(function() {t.dispatchEvent(t.CREATE, {reference:t}, false)},50 );
	},
	
	draw : function() {

		//draw it!
		this._super();

		if( this.$view === null) {
			
			if(this.containerTemplate) {
				this.$view = $(this.containerTemplate);
				this.$view.addClass(this.containerClass);	
				
				// add rtl/ltr specific classes for the containers 
				// add RTL identifier if necessary
				this.$view.addClass("frodo-"+this.getLocale().direction);
				// add IE specific classes so we can style against it using a className 
				if ( $.browser.msie ) {
					this.$view.addClass("frodo-msie");
						if ( $.browser.version == "7.0" ) {
							this.$view.addClass("frodo-msie-7");
						}
						if ( $.browser.version == "8.0" ) {
							this.$view.addClass("frodo-msie-8");
						} 
						if ($.browser.version == "9.0") {
							this.$view.addClass("frodo-msie-9");
						}
				}
				
			} else {
				return;
			}
			
			var uniqueId = ( this._renderTime - Math.floor(Math.random()* 10000000) );
			
			this.containerID = this.name+"-"+this.containerID+ "-"+uniqueId;
			this.$view.attr("id", this.containerID);
			
			if (this.backgroundTemplate) {
				this.$bgView = $(this.backgroundTemplate);
				//bg.addClass(this.backgroundClass);
				this.$bgView.attr("id", this.backgroundID+"-"+uniqueId);
				this.$view.append(this.$bgView);
			}
			
			if (this.loadingTemplate) {
				this.$loadingView = $(this.loadingTemplate);
				//this.$loadingView.addClass(this.loadingClass);
				this.$loadingView.attr("id", this.loadingID+"-"+uniqueId);
				this.$bgView.append(this.$loadingView);
			}
			if (this.contentTemplate) {
				
				this.$contentView = $(this.contentTemplate);
				//this.$contentView.addClass(this.contentClass);
				this.contentID = this.contentID+"-"+uniqueId;
				this.$contentView.attr("id", this.contentID);
				this.$bgView.append(this.$contentView);
			}
			if (this.disconnectedTemplate ) {
				
				this.$disconnectedView = $(this.disconnectedTemplate);
				this.$disconnectedView.addClass(this.disconnectedClass);
				this.disconnectedID = this.disconnectedID+"-"+uniqueId;
				this.$disconnectedView.attr("id", this.disconnectedID);
				this.$view.append(this.$disconnectedView);
				this.$disconnectedView.hide();
			}
			
			
		} else {
			this.debug("the view is not null!");
			
		}

		if (this.parentContainerID == "body") {
			$(this.parentContainerID).append(this.$view);
		} else {
			$("#" + this.parentContainerID).append(this.$view);
		}
		
		this.$view.addClass("frodo-component");
		// dispatch a display_component event so the plugins can listen for the rendering.
		this.dispatchEvent( this.DISPLAY, {type: this.name, reference: this, eventType:"draw" }, false );
	},
	
	injectContent: function(parentID, content) {
		//try raw input first
		var $targetView = this.$view.find(parentID);
		if($targetView.length == 0) {
			//not found, try forcing an id selector
			$targetView = this.$view.find("#"+parentID);
		}
		if($targetView.length == 0) {
			//still not found, try with jquery
			$targetView = $(parentID);
		}
		var $c = $(content);
		//finally, append!
		if($targetView.length > 0) {
			$targetView.append($c);
		}
		return $c;
	},
			
	//bind event listeners
	// TODO: modify to allow binding multiple events to the same handler...
	// example: ["AV_HIDDEN","AV_SHOWN", this.resize]
	bindEvents: function() {
		
		if(this.$view !== null) {
			// JASON: binding mouseover and mouseout events to add / remove hover classes,
			// so that we can style against them
			this.$view.bind( "mouseover", $.proxy( this._onMouseOver, this ) );
			this.$view.bind( "mouseout", $.proxy( this._onMouseOut, this ) );
		}
		
	},
	
	destroy:function() {
		this.dispatchEvent(this.DESTROY, {type: this.name, reference: this, eventType:"update" }, false );
		this._super();
	},
	
	bindData:function() {
		this.dispatchEvent(this.UPDATE, {type: this.name, reference: this, eventType:"update" }, false );
	},
	
	setSize:function(h,w) {

		this.$view.width(w);
		this.$view.height(h);
	},
	
	resize:function() {
		//this.debug("UPcomponent handling resize for:", this.name);
	},
	
	bindCSS:function() {
		
		/** bind any css styles
		 * that we have defined, and THEN
		 * call addClass on our views to *hopefully* override
		 * with what's in the css sheets
		 */

		for(var v in this.styles) {
			var view;
			if(v == "container"){
				view = this.$view;
			} else {
				view = this["$"+v+"View"];
			}
	
			if (view) {
				for(var s in this.styles[v]) {
					view.css(s, this.styles[v][s]);
				}
			}
		}
		
		//Apply stylesheets
		if(this.$view) {
			this.$view.addClass(this.containerClass);
		}
		if (this.$bgView) {
			this.$bgView.addClass(this.backgroundClass);
		}
		if (this.$contentView) {
			this.$contentView.addClass(this.contentClass);
		}
		if (this.$loadingView) {
			this.$loadingView.addClass(this.loadingClass);
		}
	},
	
	setLoading: function(loading) {
		
		this.loading = loading;
		if ((this.$loadingView !== null && this.$loadingView !== undefined)  
				&& (this.$contentView !== null && this.$contentView !== undefined)) {
			if (loading) {
				//draw the loading view, hide content
				this.$contentView.hide();
				this.$loadingView.show();
			} else {
				//hide the loading view, show content/
				this.$loadingView.hide();
				this.$contentView.show();
			}
		}
	},
	
	_onMouseOver: function (event) {
		this.$view.addClass(this.hoverClass);
	},
	
	_onMouseOut: function (event) {
		this.$view.removeClass(this.hoverClass);
	},
	
	_onDisconnecting: function (event) {
		this.$disconnectedView.show(this.showAnimation);
	}
	,
	
	_onDisconnected: function (event) {
		this.$disconnectedView.show(this.showAnimation);
	}
	,
	
	_onConnected: function (event) {
		this.$disconnectedView.hide(this.showAnimation);
	},
	
	_onReconnect: function (event) {
		// we dont do anything by default in here...
	}
	
});var ItemRenderer = DisplayObject.extend({
	
	name:"ItemRenderer",
	//debugEnabled:true,
	
	_baseClass:"up-item-renderer",
	selectedClass:"up-item-renderer-selected",
	
	RENDERED:"sdk.ui.itemRenderer.rendered",//hopefully going away..
	ITEM_SELECTED:"sdk.ui.itemRenderer.itemSelected",
	REQUEST_REMOVE:"sdk.ui.itemRenderer.requestRemove",
	
	data:{},
	
	init:function(cfg, data ) {
		this._super(cfg);
		if(data !== null && typeof data != "undefined") {
			this.setData(data);
		}
		
		this.bindEvents();
		var t = this;
		//setTimeout(function(){t.dispatchEvent(t.RENDERED, {item:t}, false);}, 25);
	},
	
	bindEvents:function() {
		//TODO: use UPClickHandler and store references so that we can destory
		// them when we get destroyed.
		this.$view.bind( "click", $.proxy( this._onItemSelected , this ) );
		this.$view.bind( "mouseover", $.proxy( this._onMouseOver, this ) );
		this.$view.bind( "mouseout", $.proxy( this._onMouseOut, this ) );
		
		//this._super();
	},
	
	bindData:function() {
		this.$view.html(this.data);
	},
	
	setData:function(data) {
		this.data = data;
		
		if(this.data instanceof VO) {
			this.data.removeEventListener(this.data.CHANGED, this.bindData, this);
			this.data.addEventListener(this.data.CHANGED, this.bindData, this);
		}
		
		this.bindData();
	},
	
	requestRemove:function() {
		this.debug("requesting remove! ", this);
		this.dispatchEvent(this.REQUEST_REMOVE, {renderer:this}, false);
	},
	
	setSelected: function(b){
		this.selected = b;
		if (this.selected) {
			this.$view.addClass(this.selectedClass);
		}
		else {
			this.$view.removeClass(this.selectedClass);
		}
	},
	
	_onItemSelected: function () {
		this.debug("_onItemSelected");
		this.dispatchEvent( this.ITEM_SELECTED, {renderer:this, item:this.data}, false);
	},
	
	_onMouseOver: function (event) {
		this.$view.addClass("up-item-hover");
	},
	
	_onMouseOut: function (event) {
		this.$view.removeClass("up-item-hover");
	},
	
	destroy:function() {
		if(this.data instanceof VO) {
			this.data.removeEventListener(this.data.CHANGED, this.bindData, this);
		}
		this._super();
	}
	
	
});

var ListContainer = Component.extend({
	
	name:"ListContainer",
	//debugEnabled:true,
	
	dataProvider:null,//instance of ArrayCollection
	_items:null,//list of our renderers
	rendererClass:ItemRenderer,//reference to the renderer used for all items.
	_containerClass:"frodo-listcontainer",
	containerClass: "frodo-listcontainer",
	_contentClass:"frodo-listcontainer-list",
	_backgroundClass:"frodo-listcontainer",
	autoScroll:false,
	showEmpty:false,
	loadingTemplate:"<div>This list is empty.</div>",//we're using our loadingTemplate as our 'empty' display where needed.
	contentTemplate : "<ul></ul>",
	pendingCount:0,
	_dataLength:0,
	_redrawing:false,
	_drawingProcessor:null,//instance of Processor class
	
	type: "scroll",
	pagingItemsPer: 10,
	pagingNextLabel: null,
	pagingPrevLabel: null,
	pagingSelectedPage: 1,
	pagingPrevButton: null,
	pagingNextButton: null,
	pagingMaxPages: 0,
	
	TYPE_PAGING: "paging",
	TYPE_SCROLL: "scroll",
	
	//Events
	ITEM_SELECTED:"frodo.ui.listContainer.itemSelected",
	ITEM_ADDED:"frodo.ui.listContainer.itemAdded",
	ITEM_REMOVED:"frodo.ui.listContainer.itemRemoved",
	ITEM_VIEWED:"frodo.ui.listContainer.itemViewed",
	PENDING_COUNT_CHANGE:"frodo.ui.listContainer.pendingCountChange",
	LIST_SCROLLING:"frodo.ui.listContainer.listScrolling",
	
	init:function(cfg, dp, itemRenderer, showEmpty) {
		if (dp !== null && dp !== undefined ) { // TODO type check for Arraycollection
			this.dataProvider = dp;
		} else if ( this.dataProvider === null ) {
			this.dataProvider = new ArrayCollection();
		}
		if(this.dataProvider instanceof ArrayCollection) {
			this.dataProvider.addEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
		}
		this._dataLength = this.dataProvider.getLength();
		if ( itemRenderer !== null && typeof itemRenderer !== "undefined" ) {
			this.rendererClass = itemRenderer;
		}

		if ( cfg.type !== undefined ) {
			this.type = cfg.type;
			if ( this.type == this.TYPE_PAGING ) {
				this.pagingItemsPer = cfg.pagingItemsPer;
				this.pagingPrevLabel = cfg.pagingPrevLabel;
				this.pagingNextLabel = cfg.pagingNextLabel;
			}	
		} 
		
		if(showEmpty !== null && typeof showEmpty !== "undefined") {
			this.showEmpty = showEmpty;
		}
		this.pendingCount = 0;
		this._items = [];
		this._redrawing = false;
		this._drawingProcessor = null;
		this._super(cfg);
		
	},
	
	draw:function() {
		this._super();
		this.$bgView.addClass(this._backgroundClass);
		this.$contentView.addClass(this._contentClass);
		this.setSize(this.height, this.width);
		
		if ( this.type == this.TYPE_PAGING ) {
			this.drawPagingControls();
		}
		
	},
	
	bindEvents:function() {
		//this._super();
		this.redraw();
	},

	drawPagingControls: function () {
		
		if(this.pagingPrevLabel != null && this.pagingPrevLabel.length > 0) {
			this.$contentView.append("<div class='frodo-listcontainer-prev frodo-listcontainer-pagingcontrol'>"+this.pagingPrevLabel+"</div>");
			this.pagingPrevButton = this.$view.find(".frodo-listcontainer-prev");
			new ClickHandler(this, this.pagingPrevButton, this._onPagePrev );
		}
		
		if(this.pagingNextLabel != null && this.pagingNextLabel.length > 0) {
			this.$contentView.append("<div class='frodo-listcontainer-next frodo-listcontainer-pagingcontrol'>"+this.pagingNextLabel+"</div>");
			this.pagingNextButton = this.$view.find(".frodo-listcontainer-next");
			new ClickHandler(this, this.pagingNextButton, this._onPageNext );
		}
		
		// calculate max pages
		this.pagingMaxPages = Math.ceil(this.dataProvider.getLength() / this.pagingItemsPer);
		
		this.updatePageButtonVisibility();		
	},
	
	focusPage: function () {
	    if ( this.type == this.TYPE_PAGING ) {
    		// TODO: this is being done for a single item right now, we need to go back and make it work for 
    		// sets so we can animate the entire thing as a single container.
    		var selection = this.getPagingRange();
    		// hide everything first
    		this.hideAll();
    		for ( var i = selection.start ; i < selection.end ; i++ ) {
    			// looping over the selection items and displaying them
    			this.getItemAt(i).show();
    		}
		}
	},
	
	_onPagePrev: function () {

		// decrement the selected page
		this.pagingSelectedPage = Math.max(1, this.pagingSelectedPage-1);
		this.focusPage();
		
		this.updatePageButtonVisibility();				
	},
	
	_onPageNext: function () {
		
		// incrament the selected page
		this.pagingSelectedPage = Math.min(this.pagingMaxPages, this.pagingSelectedPage+1);
		this.focusPage();
		
		this.updatePageButtonVisibility();				
	},
	
	updatePageButtonVisibility: function() {
	
		if( this.pagingPrevButton != null ) {
			if ( this.pagingSelectedPage > 1 ) {
				this.pagingPrevButton.show();
			} else {
				this.pagingPrevButton.hide();
			}
		}
		
		if( this.pagingNextButton != null ) {
			if ( this.pagingSelectedPage < this.pagingMaxPages ) {
				this.pagingNextButton.show();
			} else {
				this.pagingNextButton.hide();
			}			
		}
	},

	getPagingRange: function () {
		var endRange = this.pagingSelectedPage * this.pagingItemsPer;
		var startRange = endRange - this.pagingItemsPer;
		return { start: startRange, end: endRange };
	},
	
	hideAll: function() {
		for ( var i = 0 ; i < this._items.length ; i++ ) {
			// looping over the selection items and displaying them
			this.getItemAt(i).hide();
		}
	},
	
	setAutoScroll:function(s) {
		this.autoScroll = s;
	},

	//redraws everything from our dataProvider
	//TODO: appendItem takes a renderer but
	// we are not accounting for it here.
	redraw:function() {
		
		if( (this._items.length === this.dataProvider.getLength()) && this._items.length > 0) {
			//this.debug("length is the same.. recycle??", "dp: "+this.dataProvider.getLength(), "items: "+this._items.length);
			this._recycle();
			return;
		}
		this.removeAll();
		this._items = [];
		if(this.showEmpty && this.dataProvider.getLength() == 0) {
			this.setLoading(true);
		} else {
			this.setLoading(false);
			
			//append one item and listen for it to finish. once finished, remove listener
			// and append the next item if necessary.
			//if(!this._redrawing) {
				if(this.dataProvider.getLength() > 0) {
					this._redrawing = true;
					//this.debug("starting redraw. appending first item:", this.dataProvider.getItemAt(0));
					//var item = this.appendItem(this.dataProvider.getItemAt(0));
					//item.addEventListener(item.RENDERED, this._onItemRendered, this );
					this.debug("starting a new process!",this._drawingProcessor);

					if(this._drawingProcessor !== null) {
						this.debug("stopping processor!");
						//this._drawingProcessor.stop();
					}
					this._drawingProcessor = new Processor(this.dataProvider.toArray(), this._processItem, this);
					this._drawingProcessor.addEventListener(this._drawingProcessor.COMPLETE, this._processComplete, this);
					this._drawingProcessor.run();
				}
			//} else {
			//	this.debug(this.name+" : redraw called while already redrawing. ignoring.");
			//}
		}
		this.setSize(this.height, this.width);
		this.updatePageButtonVisibility();
	},
	
	_processItem:function(item) {
		var renderClass = null;
		// if there is a renderClass property on the VO that isnt null we should use it to render
		if ( item.renderClass !== undefined && item.renderClass !== null ) {
			renderClass = item.renderClass;
		}
		this.appendItem(item,renderClass);
	},
	
	_recycleItem:function(item) {
		var index = this.dataProvider.indexOf(item);
		this._items[index].setData(item);
	},
	
	_processComplete:function(event) {
		this.debug(this, "processor complete:", event.context.processor, this._drawingProcessor);
		var p = event.context.processor;
		p.removeEventListener(p.COMPLETE, this._processComplete, this);
		p.destroy();
		this._drawingProcessor = p = null;
	},
	
	_recycle:function() {
		this.debug("_recycle called:");
		//loop through all item renderers (that are visible??) and reset their data appropriately?
		//invisible items will get updated as they become visible, as long as we can get their index??
		//var len = this.dataProvider.getLength();
		//User Processor for this
		if(this._drawingProcessor !== null) {
			this._drawingProcessor.stop();
		}
		this._drawingProcessor = new Processor(this.dataProvider.toArray(), this._recycleItem, this);
		this._drawingProcessor.addEventListener(this._drawingProcessor.COMPLETE, this._processComplete, this);
		this._drawingProcessor.run();
		/*
		for(var i=0; i<this._items.length; i++) {
			this._items[i].setData(this.dataProvider.getItemAt(i));
		}
		*/
	},
	
	//Deprecated?
	_onItemRendered:function(event) {
		var item = event.context.item;
		item.removeEventListener(item.RENDERED, this._onItemRendered, this);
		var len = this.dataProvider.getLength();
		if(this._items.length < len) {
			var item = this.appendItem(this.dataProvider.getItemAt(this._items.length/*-1*/));
			item.addEventListener(item.RENDERED, this._onItemRendered, this );
		} else {
			this._redrawing = false;
		}
	},
	
	//TODO: index is un-used?
	appendItem:function( item, renderer, index) {
		var itemWidget = null;
		
		if(renderer===null || renderer === undefined) {
			renderer = this.rendererClass;
			//this.debug("Using default renderer:", this.rendererClass);
		}
			 
		try {
			
			itemWidget = new renderer(new ConfigVO(this.contentID), item);
			itemWidget.addEventListener(itemWidget.ITEM_SELECTED, this.onItemSelected, this);
			itemWidget.addEventListener(itemWidget.REQUEST_REMOVE, this.onRequestRemove, this);
			if(index !== undefined && index < this._items.length) {
				this._items.splice(index,0,itemWidget);
			} else {
				this._items.push(itemWidget);
			}
		} catch ( e ) { 
		}
		
		
		if(this.autoScroll) {
			this.scrollToBottom();
		}
		if(itemWidget !== null) {
			return itemWidget;
		} else {
			return item;
		}
		
	},
	
	removeAll:function()  {
		//TODO: destroy our view first then restore?
		//this.draw();//hmm...
		for(var i=this._items.length -1; i>=0; i--) {
			this.removeItem(this._items[i], i);
		}
		
	},

	removeItemAt:function(index) {
		if(index !== undefined && this._items[index] !== undefined) {
			this._items[index].removeEventListener(this._items[index].ITEM_SELECTED, this.onItemSelected, this);
			this._items[index].removeEventListener(this._items[index].PENDING_COUNT_CHANGE, this.onPendingCountChange, this);
			this._items[index].removeEventListener(this._items[index].REQUEST_REMOVE, this.onRequestRemove, this);
			this.dispatchEvent(this.ITEM_REMOVED, {item:this._items[index]}, false);
			this.debug("ABOUT TO DESTROY AN ITEM!", this._items[index]);
			this._items[index].destroy();
			this._items.splice(index,1);
		}
		
	},
	
	getItemAt:function(index) {
		if(index !== undefined && this._items[index] !== undefined) {
			return this._items[index];
		}
		return null;
		
	},
	
	removeItem:function(item, index) {
		if(index === undefined || index === null) {
			for(var i=0; i<this._items.length; i++) {
				if(this._items[i] == item ){
					index = i;
					break;
				}
			}
		}
		if(index !== undefined && index !== null) {
			this.removeItemAt(index);
		}
	},
	
	updateItem:function(item, index) {
		
		//this.debug("what is at the index currently?", this._items[index]);
		//try{
		if(this._items[index] !== undefined) {
			this._items[index].setData(item);// = item; // update the data with the new version
		} else {
			this.error(this, "attempted to update an item but cannot find it! adding it.", this._items[index], item, index);
			console.trace();
			//should we add it?//jr: this is why I'm seeing users stay in the roster list when they go offline...
			this.appendItem(item);
		}
		//this._items[index].bindData(); // binddata so the ui can respond
		//} catch(e) {
		//	this.error("error in updateItem", e, item, index);
		//}
	},
	
	setDataProvider:function(ac) {
		this.error(this,"LC setDataProvider called:", ac);
		if(ac !== undefined && ac !== null) { 
			//if (!this.getSDK().MSIE) {
				if (this.dataProvider !== null && this.dataProvider !== undefined) {
					this.dataProvider.removeEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
				}
			//}
			this.dataProvider = ac;
			this.dataProvider.addEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
			this._dataLength = this.dataProvider.getLength();

			// calculate max pages
			this.pagingMaxPages = Math.ceil(this.dataProvider.getLength() / this.pagingItemsPer);

			//this.debug("resetting the fn redraw flag.");
			this._redrawing = false;
			this.redraw();
		}
	},
	
	getDataProvider:function() {
		return this.dataProvider;
	},
	
	setSize:function(h, w) {
		this.$bgView.height(h);
		this.$bgView.width(w);
	},
	
	scrollToBottom:function() {
		this.$bgView.scrollTo("max");
	},
	
	/** Event Handlers **/
	_onDataChanged: function(event){
		if(this.showEmpty && this.dataProvider.getLength() == 0) {
			this.setLoading(true);
			return;
		} else {
			this.setLoading(false);
		}
		switch (event.context.type) {
			case this.dataProvider.ADD:
				this.onAdd(event.context.item, event.context.index);
				break;
			case this.dataProvider.REMOVE:
				this.onRemove(event.context.item, event.context.index);
				break;
			case this.dataProvider.UPDATE:
				this.onUpdate(event.context.item, event.context.index);
				break;
			case this.dataProvider.RESET:
				this.onReset();
				break;
			case this.dataProvider.SORTED:
				if(this._dataLength != this.dataProvider.getLength()) {
					this.onReset();
				} else {
					this.onSort();
				}
				break;
		}
		this._dataLength = this.dataProvider.getLength();

		// calculate max pages
		this.pagingMaxPages = Math.ceil(this.dataProvider.getLength() / this.pagingItemsPer);
		this.updatePageButtonVisibility();
		this.focusPage();
	},
	
	onItemSelected:function(event) {
		this.dispatchEvent(this.ITEM_SELECTED, event, false);
	},
	
	onRequestRemove:function(event) {
		var item = event.context.renderer;
		if(item !== null){
			this.removeItem(item);
		}
	},
	
	/** override in subclasses as necessary **/
	onAdd:function(item, index) {
		var renderClass = null;
		// if there is a renderClass property on the VO that isnt null we should use it to render
		if ( item.renderClass !== undefined && item.renderClass !== null ) {
			renderClass = item.renderClass;
		}
		this.appendItem(item, renderClass, index);
	},
	
	onRemove:function(item, index) {
		this.removeItem(item, index);
	},
	
	onUpdate:function(item, index) {
		if(item !== undefined && index !== undefined ) {
			this.updateItem(item, index);
		} 
	},
	
	onReset:function() {
		this.redraw();
	},
	
	onSort:function() {
		//JR: Suppress sorts that happen in rapid succession....
		//...
		//this.onReset();
		this._recycle();
		/*
		this.debug("SORTING AN LC");

		//loop through data provider
		// AND items and call setData() on each
		// item
		this.debug("SORTING A LISTCONTAINER");
		var len = this.dataProvider.getLength();
		for(var i=0; i<len; i++) {
			this.debug("setting data on item:", this._items[i], this.dataProvider.getItemAt(i));
			this._items[i].setData(this.dataProvider.getItemAt(i));
		}
		*/
	},

	destroy:function() {
		this.removeAll();
		this.dataProvider.removeEventListener(this.dataProvider.DATA_CHANGED, this._onDataChanged, this);
		this._super();
	}
	
});

ListContainer.prototype.TYPE_PAGING = "paging";
ListContainer.prototype.TYPE_SCROLL = "scroll";
	
	// scope jquery to the closure
	var $ = window.jQuery.noConflict(true);	
	var scope = {
		/* Classes */
		core: {
			BaseClass: BaseClass,
		},
		
		/* Cache */
		cache: {
			Cache: Cache,
			CookieCache: CookieCache,
			PersistentCache: PersistentCache,
			LocalStorageCache: LocalStorageCache,
			SessionStorageCache: SessionStorageCache,
			TemporaryCache: TemporaryCache
		},
		
		/* Data */
		data: {
			ArrayCollection: ArrayCollection,
			HashTable: HashTable,
			Model: Model,
			PersistentArrayCollection: PersistentArrayCollection,
			VO: VO,
			SerializableVO: SerializableVO
		},
		
		/* View */
		view: {
			DisplayObject: DisplayObject,
			Component: Component,
			ListContainer: ListContainer,
			ItemRenderer: ItemRenderer,
			jQuery: $,
			ConfigVO: ConfigVO
		},
		
		/* Util */
		util: {
			Browser: Browser,
			Log: Log,
			ConsoleLogger: ConsoleLogger
		},

		/* Event */		
		event: {
			Event: Event,
			EventDispatcher: EventDispatcher,
			Command: Command,
			
			ClickHandler: ClickHandler
		},
		
		service: Service,
		
		factory: {
			Factory: Factory,
			SingletonFactory: SingletonFactory,
			ServiceFactory: ServiceFactory
		}
		
	};
	var framework = new Framework(scope);

})( window );

