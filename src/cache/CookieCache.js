/**
 * CookieCache Class
 * TODO: When we write to the cookie cache check
 * for flash core.swf to exist. if so, use that instead?
 * 
 **/

	var CookieCache = Cache.extend({
		
		init: function (cacheName) {
			this.date = new Date();
			this.date.setTime(this.date.getTime()+(1*24*60*60*1000));
			//this.cacheName = cacheName; // hash the cache name to keep it safe for the cache mechanism
			this._super(cacheName);
		},
	
		getItem: function(key) {
						
			//get all cookies
			var ca = document.cookie.split(";");
			for(var i=0; i<ca.length; i++) {
				var c = ca[i].split("=");
				if(c[0].trim() == key) {
					this.debug("returning item for key "+ key + " : " + c[1]);
					try {
						var res = JSON.parse(c[1]);
					} catch (e ) {
						this.error("Error parsing json from cookie", e, c[1]);						
					}
					return res;
				}
			}
			return null;
		},
		
		setItem: function(key, obj) {
			this.debug("setItem on cookie cache:", key, obj);
			var value = "";
			
			if (typeof obj.stringify != "undefined") {
				//use the object's custom stringify
				value = obj.stringify();
			}
			else {
				//generic JSON stringify
				value = JSON.stringify(obj);	
			}
			
	        var expires = "expires="+this.date.toGMTString();
			document.cookie = key+"="+value+";"+expires+"; path=/"; // we set a path so these cookies are not sent to any server anywhere
			
		},
			
		has: function (key) {
			if ( this.getItem(key) === null ) {
				return false;
			} else {
				return true;
			}
		},
		
		removeItem: function (key) {
			var date = new Date();
			date.setTime(date.getTime()-1);
			var expires = "; expires="+date.toGMTString();
			document.cookie = key+"="+''+expires+"; path=/"; // we set a path so these cookies are not sent to any server anywhere
		},
		
		
		outOfSpace: function ( e ) {
			this.error("CookieCache out of space!", e);	
		},
		
		clear: function () {
			// no real way (??)
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				this.removeItem(cookies[i].split("=")[0]);
			}
			
		}
		
	});