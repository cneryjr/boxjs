function application(request) {
	var contextPath = request.env.contextPath;
	var uri = new String(request.env.request.getRequestURI());
	var rest = uri.replace(contextPath, "").replace(/\/.*?\/(.*)/g, "$1");
	var response = request.env.response;

	if (rest.match(/.*?\.js$/g) != null) {
		log.info("Running script " + rest);
		global.queryString = request.queryString;
		load(rest);
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

