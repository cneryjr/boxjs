var safe = safe | {};

safe.isItSafe = function (paramsObject, request, response) {
	var uri = new String(request.env.request.getRequestURI());
	var p = uri.split("/");
	var moduleName = p[p.length-2];
	var methodName = p[p.length-1];	

    return isUserLogged(paramsObject, request, response)
        && isSessionValid(paramsObject, request, response)
        && hasPermissionInThisModule(paramsObject, request, response, moduleName)
        && hasPermissionInThisMethod(paramsObject, request, response, methodName);
};

safe.isUserLogged = function(paramsObject, request, response) {

    return true;
};

safe.isUserLogged = function (paramsObject, request, response) {

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
