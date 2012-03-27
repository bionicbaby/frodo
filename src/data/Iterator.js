/**
 *  Iterator
 **/

var Iterator = BaseClass.extend({
	
	/**
     * Nothing is a class that represents nothing
     * @constructor
     */
	
	NO_ELEMENT_EXCEPTION: "NoSuchElementException",
	
	init: function (data) {
		this.debug("constructing iterator");
		this.data = data;
		this.index = 0;
		this._super();
	},
	
	hasNext: function () {
		var result = this.index < this.data.length;
		return result;
	},
	
	next: function () {
		if ( this.hasNext() ) {
			this.index++;
		} else {
			throw( this.NO_ELEMENT_EXCEPTION );
		}
	},
	
	prev: function () {
		this.index--;
	},
	
	current: function () {
		return this.data[this.index];
	},
	
	array: function () {
		return this.data;
	}
	
});