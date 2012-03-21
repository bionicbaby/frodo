/** Command.js
 * base class for all commands
 * all commands should override the execute function
 */

var Command = BaseClass.extend({
	name:"Command",
	execute:function(event) {}
});
