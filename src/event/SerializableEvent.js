var SerializableEvent = com.socialbit.data.VO.extend({
	
	__type__: "SerializableEvent",
	__baseClass__: "SerializableEvent",
	context: {},
	
	init: function ( ) {
		this.__baseClass__ = "Event";
	},
	
	getSerializableData: function () {
		var temp = {};
		if ( this["__type__"] !== undefined ) {
			temp["__type__"] = this.__type__;
			temp["__baseClass__"] = this.__baseClass__;
			temp["context"] = {}
		}
		return temp;
	}
	
});
