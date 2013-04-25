var safe = safe || {};

safe.isItSafe = function (paramsObject, request, response) {
	var uri = new String(request.env.request.getRequestURI());
	var p = uri.split("/");
	var moduleName = p[p.length-2];
	var methodName = p[p.length-1];	

    return this.isUserLogged(paramsObject, request, response)
        && this.isSessionValid(paramsObject, request, response)
        && this.hasPermissionInThisModule(paramsObject, request, response, moduleName)
        && this.hasPermissionInThisMethod(paramsObject, request, response, methodName);
};

safe.isUserLogged = function(paramsObject, request, response) {

    return true;
};

safe.isSessionValid = function (paramsObject, request, response) {

    return true;
};

safe.hasPermissionInThisModule = function (paramsObject, request, response, moduleName) {

    return true;
};

safe.hasPermissionInThisMethod = function (paramsObject, request, response, methodName) {

    return true;
};

safe.onError = function (paramsObject, request, response) {
	response.setContentType("text/html");
	response.write("<H1>boxJS error: permission denied.</H1>");
};

print("security.js loaded ......................................................");
