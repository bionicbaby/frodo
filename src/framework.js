/**
 * @class
 * @description The primary framework class contains all core framework functions
 */

var Framework = EventDispatcher.extend({
	
	LOADED: "frameworkLoaded",
	
	/**
	 * @static
	 * @description Static variable for browser detection of Webkit ( Safari or Chrome )
	 */
	WEBKIT: ( Browser.browser == 'Chrome' || Browser.browser == "Safari" ) ? true : false,

	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer
	 */
	MSIE: ( Browser.browser == 'Explorer' ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer 7
	 */
	MSIE7: ( Browser.browser == 'Explorer' && Browser.version == 7 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer 8
	 */
	MSIE8: ( Browser.browser == 'Explorer' && Browser.version == 8 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer 9
	 */
	MSIE9: ( Browser.browser == 'Explorer' && Browser.version == 9 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Microsoft Internet Explorer 10
	 */
	MSIE10: ( Browser.browser == 'Explorer' && Browser.version == 10 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Firefox 3.x
	 */
	FF3: ( Browser.browser == 'Firefox' && Browser.version == 3 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Firefox 4.x
	 */
	FF4: ( Browser.browser == 'Firefox' && Browser.version == 4 ) ? true : false,
	
	/**
	 * @static
	 * @description Static variable for browser detection of Firefox 5 or later
	 */
	FF5plus: ( Browser.browser == 'Firefox' && Browser.version > 4 ) ? true : false,
	
	init: function (scope) {
		
		// alias publically
		scope.noConflicts = this.noConflicts;
		window.winston = scope;
		this.dispatchEvent(this.LOADED,{scope:scope});
		
	},
	
	/**
	 * @description used to load core modules.
	 */
	loadModule: function ( name, path ) {
		
	},
	
	/**
	 * @description Used to eliminate any potential conflicts with someone else using a different version of winston
	 */
	noConflicts: function (remove) {
		
		if ( remove ) {
			delete window.winston;
		}
		
		// send an alias back to the caller and then remove the alias on the window.
		return scope;
	}
	
});
