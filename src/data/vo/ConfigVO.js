/**
 * VO class
 * TODO: Create an 'instance' property to store all of our 'public' properties.
 * return this in stringify.
 */

/**
 * ConfigVO Class
 * 
 * @param {Object} width
 * @param {Object} height
 * @param {Object} containerId
 * 
 */

ConfigVO = VO.extend({

	width:"100%",
	height:"100%",	
	containerId:"body",
	data:{},
	parent:null,
	
	init: function (width, height, containerId, data, parent) {
		this._super();
		this.set("width", width);
		this.set("height", height);
		this.set("containerId", containerId);
		this.set("data", data);
		this.set("parent", parent);
		this._super();
	}
	
});
