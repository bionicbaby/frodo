/**
 * VO class
 * TODO: Create an 'instance' property to store all of our 'public' properties.
 * return this in stringify.
 */

var SerializableVO = VO.extend({
	
	__type__: "SerializableVO",
	name: "SerializableVO",
	
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
	
	setSerializedData: function (data) {
		for(var a in data) {
			this[a] = data[a];
		}
	},
	
	destringify: function (stringData) {
		var data = JSON.parse(stringData);
		this.setSerializedData(data);	
	}
		
});
