
function application(request) {
	var contextPath = request.env.contextPath;
	var uri = new String(request.env.request.getRequestURI());
	var rest = uri.replace(contextPath, "").replace(/\/.*?\/(.*)/g, "$1");
	var response = request.env.response;
	
	var exports = {};
	org.mozilla.javascript.ScriptableObject.putProperty(scope, "exports", exports);

	if (rest.match(/.*?\.js$/g) != null) {
		log.info("Running script " + rest);
		global.queryString = request.queryString;
		load(rest);
	} else if (rest.match(/actions\/(\w+)/g) != null) {
		var act = rest.replace(/actions\/(\w+)/g, "$1");
		var actions = require("actions.js").actions;
		actions[act](parseParams(request.queryString), request);
		//response.write(rest.replace(/\/actions\/(\w+)/g, "$1"));
		//response.write("<br>" + JSON.stringify(actions));
	} else {
		response.setContentType("text/html");
		response.write("<H1>boxJS is running!</H1>");
		var act = rest.replace(/\/actions\/(\w+)/g, "$1");
		response.write(act);
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

