/**
 * ClickHandler
 * 
 * description: A wrapper for click events. IE8 triggers an onBeforeUnload event
 * whenever a javascript href is clicked. We use event.preventDefault() to keep
 * this from happening.
 * 
 * @param {Object} owner
 * @param {Object} button
 * @param {Object} handler
 */

var Proxy = function ( scope, callback ) {
    return function () { callback.apply( scope, arguments ); }
}

module.exports = Proxy;
