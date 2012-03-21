


	/** @class TransportModule
	 * @extends BaseClass
	 * @description 
	 * @see Service
	 */
	
	var TransportModule = Module.extend(/** @lends TransportModule.prototype */{
		
		/** @public
		 * @description The name for this class.
		 */
		name:"TransportModule",
		
		_registry: null,
		
		/**
		 * @constructs
		 */
		init: function () {
			this.TransportFactory = new Factory();
		}
			
	});
		
