/**
 * 
 */

var ConsoleLogger = Class.extend({
	
	prefix: null,
	
	init: function (prefix) {
		this.prefix = prefix;
	},
	
	debug: function () {
		var args = [];
		args[0] = "--" + " " + this.prefix + " -- ";
		for ( var i = 0 ; i < arguments.length ; i++ ) {
			args[i+1] = arguments[i];
		}
		console.log.apply( console, args);
	},
	
	error: function () {
		var args = [];
		args[0] = "--" + " " + this.prefix + " -- ";
		for ( var i = 0 ; i < arguments.length ; i++ ) {
			args[i+1] = arguments[i];
		}
		console.error.apply( console, args);
	},
	
	info: function () {
		var args = [];
		args[0] = "--" + " " + this.prefix + " -- ";
		for ( var i = 0 ; i < arguments.length ; i++ ) {
			args[i+1] = arguments[i];
		}
		console.info.apply( console, args);
	},
	
	fatal: function () {
		var args = [];
		args[0] = "--" + " " + this.prefix + " -- ";
		for ( var i = 0 ; i < arguments.length ; i++ ) {
			args[i+1] = arguments[i];
		}
		console.error.apply( console, args);
	}
	
});