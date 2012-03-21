/**
 * 
 */

var Log = Class.extend({
	
	/**
	 * @description the logger class itself, this is used to log in different and interesting ways.  For now just defaulting to a console, in future we could use this to log to a server as needed
	 * @version not implemented
	 */
	_logger: null,
	
	/**
	 * @constructs
	 */
	init: function ( prefix, logger  ) {
		if ( logger === undefined && this._logger == null ) {
			this._logger = new ConsoleLogger(prefix);
		}
	},
	
	/**
	 * @description log a basic message
	 */
	debug: function () {
		this._logger.debug.apply(this._logger.debug, arguments);
		//this._logger.debug(arguments);
	},
	
	/**
	 * @description log an error message
	 */

	error: function () {
		this._logger.error.apply(this._logger.error, arguments);
		//this._logger.error(arguments);
	},
	
	/**
	 * @description log an info message
	 */
	info: function () {
		this._logger.info.apply(this._logger.info, arguments);
		//this._logger.info(arguments);
	},
	
	/**
	 * @description log a fatal error message
	 */
	fatal: function () {
		this._logger.fatal(arguments);
	}
	
});

Log.prototype.DEBUG = "debug";
Log.prototype.WARN = "warn";
Log.prototype.ERROR = "error";
Log.prototype.FATAL = "FATAL";