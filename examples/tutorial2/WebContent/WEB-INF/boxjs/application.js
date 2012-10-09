
function application(request) {
	var contextPath = request.env.contextPath;
	var uri = new String(request.env.request.getRequestURI());
	var rest = uri.replace(contextPath, "").replace(/\/.*?\/(.*)/g, "$1");
	var response = request.env.response;
	
	//var exports = {};
	org.mozilla.javascript.ScriptableObject.putProperty(scope, "exports", {});

	if (rest.match(/.*?\.js$/g) != null) {
		/** Run URL that addresses a Javascript file with extension .js */
		log.info("Running script " + rest);
		global.queryString = request.queryString;
		load(rest);
	} else if (rest.match(/actions\/(\w+)/g) != null) {
		/** Example of how to process a Restful call.In this example when 
		 * the URL starts with "/actions/fncTest" the boxJS will load a 
		 * file called "actions.js" and will run the function "fncTest" 
		 * defined within the file, using an object called "actions" too. */
		var act = rest.replace(/actions\/(\w+)/g, "$1");
		var actions = require("actions.js").actions;
		actions[act](parseParams(request.queryString), request);
	} else {
		response.setContentType("text/html");
		response.write("<H1>boxJS is running!</H1>");
	}
	return {
		status : 200,
		headers : {
			"content-type" : response.getContentType()
		},
		body : [ response.toString() ]
	};
}

print("application.js loaded...........................................");

