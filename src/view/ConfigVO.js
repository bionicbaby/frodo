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
