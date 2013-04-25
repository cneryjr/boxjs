/**
 * Version: v0.2.8
 * 
 * @param request: Request
 * @returns {Response}
 */
function application(request) {
	var contextPath = request.env.contextPath;
	var uri = new String(request.env.request.getRequestURI());
	var rest = uri.replace(contextPath, "").replace(/\/.*?\/(.*)/g, "$1");
	var response = request.env.response;

	if (rest.match(/.*?\.js$/g) != null) {
		/** Run URL that addresses a Javascript file with extension .js */
		//log.info("Running script " + rest);
		global.queryString = request.queryString;
		load(rest);
	} else if (rest.match(/actions\/(\w+)/g) != null) {
		/** Example of how to process a Restful call.In this example when 
		 * the URL starts with "/actions/fncTest" the boxJS will load a 
		 * file called "actions.js" and will run the function "fncTest" 
		 * defined within the file, using an object called "actions" too. */
		var act = rest.replace(/actions\/(\w+)/g, "$1");
		var actions = require("actions.js").actions;
		actions[act](http.parseParams(decodeURI(request.queryString || "")), request, response);
	} else if (rest.match(/debugger\/proxy\/(\w+)/g) != null) {
		var method = rest.replace(/debugger\/proxy\/(\w+)/g, "$1");
		var methods = require("debugger/proxy.js").methods;
		methods[method](http.parseParams(decodeURI(request.queryString || "")), request, response);
	} else {
		response.setContentType("text/html");
		response.write("<H1>boxJS is running!</H1>");
	}
	
    response.headers["content-type"] = response.getContentType();

    var resp = {
        status: 200,
        headers: response.headers,
        body: [response.out]
    };

    if (["text/html", "text/xml", "text/plain", "text/javascript", "application/json"].indexOf(response.getContentType()) == -1) {
        resp.contentLength = response.out.length;
        resp.headers = response.headers;
        resp.body = response.out;
    }

    return resp;                    
}

print("application.js loaded ..................................................");

