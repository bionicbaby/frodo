


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
		 * @public
		 * @description instances can have a label.
		 */
		
		label:"",
		
		/** 
		 * @constructs
		 **/
		init:function() {
			
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
			if(this.debugEnabled ) {
				if(this._log !== null) {
					this._log.debug(arguments);
				} else {
					console.log(arguments);
				}
			}
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
		
