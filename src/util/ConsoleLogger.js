/**
 * 
 */

var ConsoleLogger = Class.extend({
	
	prefix: null,
	
	init: function (prefix) {
		this.prefix = prefix;
	},
	
	debug: function () {
		console.log( this.prefix, arguments);
	},
	
	error: function () {
		console.error( this.prefix, arguments);
	},
	
	info: function () {
		console.info( this.prefix, arguments);
	},
	
	fatal: function () {
		console.error( " !! FATAL !! " + this.prefix, arguments);
	}
	
});