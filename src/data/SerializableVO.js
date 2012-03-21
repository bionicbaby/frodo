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
