
	var ServiceFactory = SingletonFactory.extend({
		
		name: "ServiceFactory",
		
		init: function (config) {
			this._super(Service);
			this.config = config;
		},
		
		create: function (svc) {
			this._super(svc,this.config);
		}
		
	});