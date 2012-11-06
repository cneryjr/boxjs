var db = {};
var ui = {};
var http = {};
var utils = {};
var global = {};

/* Controla cache dos scripts */
var scripts = {}; 


function require(filename) {
	return servlet.require(filename);
}

function runScript(scope, filename) {
	var rd = null;
	var ret = "";
	
	try {
		var filePath = "/WEB-INF/boxjs" + filename;
		filePath = global.request.getServletContext().getRealPath(filePath);
		var srcName = filePath.replaceAll(".*?\\\\(\\w+\\.\\w+)", "$1");

		ret = global.jscontext.evaluateReader(scope, rd = new java.io.FileReader(filePath), srcName, 1, null);
		scripts[filename] = true;
	} catch (e) {
		throw new Error('Error loading javascript file: ' + filename + '. \nMessage: ' + e.message);
	} finally {
		try {
			if (rd != null)
				rd.close();
		} catch (e) {
			throw new Error('Error loading javascript file (rd.close): ' + filename
					+ '. \nMessage: ' + e.message);
		}
	}
	return org.mozilla.javascript.Context.toString(ret);
}

function load(filename) { 
	print("loading(" + filename + ")....................................................");
	return runScript(global.scope, config.applicationRoot + filename);
	print(filename + "loaded!!!");
}

function loadOnce(filename) {
	if (!scripts[filename]) {
		runScript(global.scope, filename);
	}
}

function print() {
	var args = Array.apply(null, arguments);
	java.lang.System.out.println(args.join(""));
}

function service(request, response) {
	var qryString = null;
	
	if (!(request.getContentType() != null && request.getContentType().startsWith("multipart/form-data"))) {
		print("\nContentType: " + request.getContentType() + " ....................................\n");
		qryString = request.getReader().readLine();
		qryString = (qryString == null || qryString.equals("")) 
						? request.getQueryString()
						: qryString;
	}
	var rrequest = {
		    version: [1, 1], /* parsed HTTP version ~ "HTTP/1.1" */
		    method: request.getMethod(),
			queryString: (qryString) ? new String(qryString) : null,
		    headers: { /* HTTP headers, lowercased but otherwise unmangled */
		        host: "boxjs.com.br",
		        "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3",
		        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		        "accept-language": "en-us,en;q=0.5",
		        "accept-encoding": "gzip,deflate",
		        "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
		        "keep-alive": "300",
		        connection: "keep-alive",
		        "if-modified-since": request.getHeader("if-modified-since") || "Fri, 28 Sep 2012 13:37:50 GMT",
		        "cache-control": "max-age=0"
		    },
		    /*input: request.getInputStream(), */ /* request body stream */
		    scheme: request.getScheme(),
		    host: request.getServerName() || "boxjs.com.br",
		    port: request.getServerPort(),
			scriptName: "",
			pathInfo: request.getPathInfo(),
		    env: global = { /* this is the place where Server and Middleware put keys */
		        boxjs: {
		            version: [0, 1]
		        },
		        session: request.getSession(),
		        contextPath: new String(request.getServletContext().getContextPath()),
		        scope: scope,
		        jscontext: jscontext,
		        request: request,
		        response: { 
		        		out: new String(),
		        		"content-type": "text/html",
		        		getContentType: function() {
		        			return this["content-type"];
		        		},
		        		setContentType: function(type) {
		        			this["content-type"] = type;
		        		},
		        		write: function (content) {
		        			this.out += content;
		        			return this;
		        		},
		        		toString: function() {
		        			return this.out;
		        		}
		        	}
		    },
		    jsgi: {
		        version: [0, 3],
		        /* errors: (new OutputStream), */
		        multithread: false,
		        multiprocess: true,
		        runOnce: false,
		        async: true,
		        cgi: false, /* [1, 1] if CGI/1.1 */
				ext: {}
		    }
	};
	
	//java.lang.System.out.println("\n-- QueryString ---------------------------------\n" + rrequest.queryString);
	var rresponse = application(rrequest);
	response.setContentType(rresponse.headers["content-type"] || "text/html");
	response.getWriter().println(rresponse.body.join(""));
}

http.parseParams = function(strParams) { 
	
	function parseKey(skey, value) { 
		var patt = /\w+|\[\w+\]/g; 
		var k, key = patt.exec(skey)[0]; 
		var m, p = params; 
		while ((k = patt.exec(skey)) != null) { 
			k = k.toString().replace(/\[|\]/g,""); 
			var m = k.match(/\d+/gi); 
			if (m != null && m.toString().length == k.length) { 
				k = parseInt(k); p[key] = p[key] || []; 
			} else { 
				p[key] = p[key] || {}; 
			} 
			p = p[key]; key = k; 
		} 
		p[key] = value	.replace(/\+/g, ' ')
						.replace(/%3A/g,":")
						.replace(/%2C/g,",")
						.replace(/%2B/g,"+")
						.replace(/%25/g,'%')
						.replace(/%3D/g,'=')
						.replace(/%2F/g,'/'); 
	}
	
	function parseParam(sparam) { 
		var [key,value] = sparam.split('='); 
		parseKey(key, value); 
	} 
	
	var params = {}; 
	
	if (strParams != null && strParams != "") {
		var arrParams = strParams.replace(/%5B/g, "[").replace(/%5D/g, "]").split('&'); 
	
		for (var i=0; i < arrParams.length; i++) { 
			parseParam(arrParams[i]); 
		} 
	}

	return params; 
};

http.uploadFile = function(path) { 
	var contentType = global.request.getContentType();
	
	if ((contentType != null) && (contentType.indexOf("multipart/form-data") >= 0)) {
		var fin = new java.io.DataInputStream(global.request.getInputStream());
		var formDataLength = global.request.getContentLength();
		//byte dataBytes[] = new byte[formDataLength];
		var dataBytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, formDataLength);
		var byteRead = 0;
		var totalBytesRead = 0;
		
		while (totalBytesRead < formDataLength) {
			byteRead = fin.read(dataBytes, totalBytesRead, formDataLength);
			totalBytesRead += byteRead;
		}
	
		var file = new java.lang.String(dataBytes);
		var saveFile = file.substring(file.indexOf("filename=\"") + 10);
		saveFile = saveFile.substring(0, saveFile.indexOf("\n"));
		saveFile = saveFile.substring(saveFile.lastIndexOf("\\") + 1, saveFile.indexOf("\""));
		
		var lastIndex = contentType.lastIndexOf("=");
		var boundary = contentType.substring(lastIndex + 1, contentType.length());
		var pos;
		
		pos = file.indexOf("filename=\"");
		pos = file.indexOf("\n", pos) + 1;
		pos = file.indexOf("\n", pos) + 1;
		pos = file.indexOf("\n", pos) + 1;

		var boundaryLocation = file.indexOf(boundary, pos) - 4;
		var startPos = ((file.substring(0, pos)).getBytes()).length;
		var endPos = ((file.substring(0, boundaryLocation)).getBytes()).length;
		print("File Path: " + path + saveFile + "\n");
		var ff = new java.io.File(path + saveFile);
		
		var fileOut = new java.io.FileOutputStream(ff);
		fileOut.write(dataBytes, startPos, (endPos - startPos));
		fileOut.flush();
		fileOut.close();
	}
};


print("boxjsServlet.js loaded...........................................");
