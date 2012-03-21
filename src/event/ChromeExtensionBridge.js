
var ChromeExtensionBridge = EventDispatcher.extend({
	
	port: null,
	
	init: function () {
		this._super();
		console.log("chrome extension bridge loaded!");
		this.port = chrome.extension.connect({name: "contentScriptPort"});
		this.port.postMessage({event:"chrome.extension.opened"});
		this.port.onMessage.addListener( this.onMessage );
	},
	
	onMessage: function(msg) {
		console.log("got a message from bg.html",msg);
	},
	
	postMessage: function(event) {
		console.log("postMessage",event);
		// pass the stringified event to the port "background.html"
		this.port.postMessage(event.stringify());
	}
	
});