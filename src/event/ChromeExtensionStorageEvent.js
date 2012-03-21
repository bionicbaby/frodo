var ChromeExtensionStorageEvent = SerializableEvent.extend({
	
	__type__: "ChromeExtensionStorageEvent",

	init: function ( type, cacheName, key, value ) {
		this._super();
		this.name = this.__type__;
		this.context.type = type;
		this.context.cacheName = cacheName;
		this.context.key = key;
		this.context.value = value;
	},
	
	getSerializableData: function () {
		var temp = this._super();
		if ( this["__type__"] !== undefined ) {
			temp["name"] = this.__type__;
			temp["context"]["type"] = this.context.type; 
			temp["context"]["cacheName"] = this.context.cacheName;
			temp["context"]["key"] = this.context.key; 
			temp["context"]["value"] = this.context.value; 
		}
		return temp;
	}
	
});
ChromeExtensionStorageEvent.prototype.SET = "chrome.extension.cache.set";
ChromeExtensionStorageEvent.prototype.RESTORE = "chrome.extension.cache.restore";
