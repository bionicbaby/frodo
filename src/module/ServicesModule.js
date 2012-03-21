


	/** @class ServiceModule
	 * @extends BaseClass
	 * @description 
	 * @see Service
	 */
	
	var ServiceModule = Module.extend(/** @lends TransportModule.prototype */{
		
		/** @public
		 * @description The name for this class.
		 */
		name:"ServiceModule",
		
		_registry: null,
		
		/**
		 * @constructs
		 */
		init: function () {
			this.TransportFactory = new Factory();
		}
			
	});
		
