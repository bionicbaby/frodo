var TabVO = SerializableVO.extend({
	
	name:"TabVO",
	//debugEnabled:true,
	
	__type__:"TabVO",
	
	index:0,		// our index in the list
	type:null,		// String Class name for our child component
	data:{},		// custom data passed to the tab's child instance.
	label:"",		//	tab label
	visible:true,	// whether or not we're visible or not
	active:false,	//focused
	
	init:function(label, type, data) {
		this._super();
		this.type = type;
		this.data = data;
		this.label = label;
		this.visible = true;
		this.active = false;
	},
	
	getSerializableData: function () {
		var temp = this._super();
		temp.index = String(this.index);
		temp.type = String(this.type);
		temp.data = this.data;
		temp.label = String(this.label);
		temp.visible = Boolean(this.visible);
		temp.active = Boolean(this.active);
		return temp;
	}
	
});