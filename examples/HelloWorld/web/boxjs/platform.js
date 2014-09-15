var internal = {};
/** @namespace Agrupa funcionalidades relativas a banco de dados. */
var db = {};
/** @namespace */
var ui = {};
/** @namespace */
var binary = {};
/** @namespace */
var io = {};
/** @namespace */
var ws = {};
/** @namespace */
var utils = {};
/** @namespace */
var global = {};
/** @namespace */
var safe = {
	isItSafe: function() {
		return true;
	},
	onError: function(){
	}
};
var console = {
    log: function(msg) {
            print(msg);
    }
};

var Router = {
	getRoutes: {},
	postRoutes: {},
	putRoutes: {},
	deleteRoutes: {},
	add: function(virtualPath, realPath) {
		this.getRoutes[virtualPath] = 
		this.putRoutes[virtualPath] = 
		this.postRoutes[virtualPath] = 
		this.deleteRoutes[virtualPath] = realPath;
		return this;
	},
	get: function(virtualPath, realPath) {
		this.getRoutes[virtualPath] = realPath;
		return this;
	},
	put: function(virtualPath, realPath) {
		this.putRoutes[virtualPath] = realPath;
		return this;
	},
	post: function(virtualPath, realPath) {
		this.postRoutes[virtualPath] = realPath;
		return this;
	},
	"delete": function(virtualPath, realPath) {
		this.deleteRoutes[virtualPath] = realPath;
		return this;
	},

	process: function(method, url, paramsObject, request, response) {
            var regex = new RegExp("/(?:.(?!/.*/))+$", "g");
            var nurl = url;
            var params = paramsObject || {};

            function displayBoxJSRunning() {
                    response.setContentType("text/html");
                    response.write("<H1>boxJS is running!!!</H1>");                    
            }

            function runMethodOnModule(nurl) {
                var path = nurl.split("/");
                var methodName = path.pop();
                var module = require(path.join("/") + ".js");
                
                module[methodName](paramsObject, request, response);
            }

            if ( nurl == "/boxjs" ) {   //print("1.DEBUG...");
                displayBoxJSRunning();
            } else if ( nurl.match(/.*?\.js$/g) != null ) {   //print("4.DEBUG");
                    loadjs(nurl);			
            } else {    //print("1a.DEBUG");
                for (var route in this[method.toLowerCase() + "Routes"]) {
                    var r = route.replace(/^\//, "");
                    /* "users/123".match( ":coll/:id".replace(/:(\w+)/g, "(\\w+)").replace("/", "\\/") ); */   
                    var placeholderRoute = url.match( r.replace(/:(\w+)/g, "(\\w+)").replace("/", "\\/") );
                    var regexRoute = url.match(r);

                    if ( regexRoute ) {   //print("2.DEBUG");
                        var novaRota = this[method.toLowerCase() + "Routes"][route];
                        
                        if (regexRoute.length > 1) {
                            regexRoute.shift(1);
                            /* passa um array com as partes do path da rota invocada */
                            request.routePath = regexRoute;

                            print("url: " + url + " \tr: " + r);
                            print("request.routePath: [" + request.routePath + "]");
                            print("novaRota: [" + novaRota + "]");

                        } else if (typeof(novaRota) == 'string') {
                            novaRota = url.replace(r, novaRota);
                        }
                        
                        if (typeof(novaRota) == 'function')
                            novaRota(params, request, response);
                        else
                            runMethodOnModule(novaRota);
                        
                        return;
                    } else if ( placeholderRoute ) {   print("3.DEBUG");
                        var ids = r.match(/:(\w+)/g);
                        var i=0;

                        placeholderRoute.shift(1); 
                        placeholderRoute.forEach(function(id) {
                            console.log(ids[i] + " => " + id);
                            params[ids[i++].slice(1)] = id;
                        });

//                        this[method.toLowerCase() + "Routes"][route](params, request, response);
                        var novaRota = this[method.toLowerCase() + "Routes"][route];
                        
                        if (typeof(novaRota) == 'function')
                            novaRota(params, request, response);
                        else
                            runMethodOnModule(novaRota);

                        return;
                    }
                }
                if ( nurl.match(regex) != null ) {   //print("5.DEBUG => " + nurl);
                    runMethodOnModule(nurl);
                    return;
                }
            } 
            
            //print("6.DEBUG...........");
            //displayBoxJSRunning();
        }
};

/** Controla cache dos scripts */
var scripts = {}; 


/**
 * Carrega um <tt>m&oacute;dulo</tt> Javascript disponibilizando no contexto somente as 
 * vari&aacute;veis e fun��es que foram exportadas.
 * @param {string} filename O nome do arquivo (m&oacute;dulo) a ser importado.
 * @returns {Object}
 */
function require(filename) {
    //var fname = servlet.getServletConfig().getServletContext().getRealPath("/" + filename.replace(/^\//g, ""));
    var fname = servlet.getServletConfig().getServletContext().getRealPath("/boxjs/" + filename.replace(/^\//g, ""));

    this.exports = {};
    load(fname);

    return this.exports;
}

function loadjs(filename) {
    if (!scripts[filename]) {
        var fname = servlet.getServletConfig().getServletContext().getRealPath("/boxjs/" + filename.replace(/^\//g, ""));

        this.exports = {};
        load(fname);
//        return this.exports;
    }
}

function print() {
	var args = Array.apply(null, arguments);
	java.lang.System.out.println(args.join(""));
}

internal.procRequest = function (paramsObject, req, response) {

    http.request = req;

    if (!safe.isItSafe(paramsObject, req, response)) {
        safe.onError(paramsObject, req, response);
    } else {
        // Router.process(request.method, rest, paramsObject, request, response);
        Router.process(req.method, req.rest, paramsObject, req, response);
    }

    response.headers["content-type"] = response.getContentType() || "text/html";

    var resp = {
        status: 200,
        headers: response.headers,
        body: [response.out]
    };

    if (["text/html", "text/xml", "text/plain", "text/javascript", "application/json"].indexOf(response.getContentType()) === -1) {
        resp.contentLength = response.out.length;
        resp.headers = response.headers;
        resp.body = response.out;
    }

    response.out = "";
    resp.joinedBody = resp.body.join("");
    
    return resp;
}

function application(request) {
    var contextPath = request.env.contextPath;
    var uri = new String(request.env.request.getRequestURI());
    var rest = uri.replace(contextPath, "").replace(/\/.*?\/(.*)/g, "$1");
    var response = request.env.response;
    var paramsObject = http.parseParams(decodeURI(request.queryString || ""));

    if (!safe.isItSafe(paramsObject, request, response)) {
        safe.onError(paramsObject, request, response);
    } else {
        // Router.process(request.method, rest, paramsObject, request, response);
        Router.process(request.method, rest, paramsObject, request, response);
    }

    response.headers["content-type"] = response.getContentType() || "text/html";

    var resp = {
        status: 200,
        headers: response.headers,
        body: [response.out]
    };

    if (["text/html", "text/xml", "text/plain", "text/javascript", "application/json"].indexOf(response.getContentType()) === -1) {
        resp.contentLength = response.out.length;
        resp.headers = response.headers;
        resp.body = response.out;
    }

    return resp;
}


function service(requestJava, responseJava) {
	var qryString = null;

	if (!(requestJava.getContentType() != null && requestJava.getContentType().startsWith("multipart/form-data"))) {
		// print("\nContentType: " + request.getContentType() + " ....................................\n");
		qryString = requestJava.getReader().readLine();
		qryString = (qryString == null || qryString.equals("")) ? requestJava
				.getQueryString() : qryString;
	}

	var rrequest = {
		version : [ 1, 1 ], /* parsed HTTP version ~ "HTTP/1.1" */
		method : requestJava.getMethod(),
		queryString : (qryString) ? new String(qryString) : null,
		headers : { /* HTTP headers, lowercased but otherwise unmangled */
			host : "boxjs.com.br",
			"user-agent" : "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3",
			accept : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			"accept-language" : "en-us,en;q=0.5",
			"accept-encoding" : "gzip,deflate",
			"accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
			"keep-alive" : "300",
			connection : "keep-alive",
			"if-modified-since" : requestJava.getHeader("if-modified-since") || "Fri, 28 Sep 2012 13:37:50 GMT",
			"cache-control" : "max-age=0"
		},
		/* input: request.getInputStream(), *//* request body stream */
		scheme : requestJava.getScheme(),
		host : requestJava.getServerName() || "boxjs.com.br",
		port : requestJava.getServerPort(),
		scriptName : "",
		pathInfo : requestJava.getPathInfo(),
		env : global = { /* this is the place where Server and Middleware put keys */
			boxjs : {
				version : [ 0, 1 ],
				session: requestJava.getSession(),
				servlet: servlet,
				request: requestJava,
				response: responseJava
			},
			session : requestJava.getSession(),
			contextPath : new String(requestJava.getServletContext().getContextPath()),
			scope : rootScope,
			//jscontext : jscontext,
			request : requestJava,
			response : {
				out : new String(),
				headers : {},
				contentLength : null,
				"content-type" : "text/html",
				getContentType : function() {
					return this["content-type"];
				},
				setContentType : function(type) {
					this["content-type"] = type;
				},
				write : function(content) {
					this.out += content;
					return this;
				},
				setOut : function(content) {
					this.out = content;
					return this;
				},
				toBytes : function() {
					return new java.lang.String(this.out).getBytes();
				},
				toString : function() {
					return this.out;
				},
				addHeader : function(name, value) {
					this.headers[name] = value;
				},
				setContentLength : function(contentLength) {
					this.contentLength = contentLength;
				}
			}
		},
		jsgi : {
			version : [ 0, 3 ],
			/* errors: (new OutputStream), */
			multithread : false,
			multiprocess : true,
			runOnce : false,
			async : true,
			cgi : false, /* [1, 1] if CGI/1.1 */
			ext : {}
		}
	};

	// java.lang.System.out.println("\n-- QueryString
	// ---------------------------------\n" + rrequest.queryString);
	var rresponse = application(rrequest);

	for (var key in rresponse.headers) {
		responseJava.setHeader(key, rresponse.headers[key]);
	}

	if (rresponse.contentLength != null) {
		responseJava.setContentLength(rresponse.contentLength);
	}

	//if (rresponse.headers["content-type"] == "text/html") {
	if (["text/html", "text/xml", "text/plain", "text/javascript", "application/json"].indexOf(rresponse.headers["content-type"]) >= 0) {
		responseJava.getWriter().println(rresponse.body.join(""));
		responseJava.flushBuffer();
	} else {
		responseJava.getOutputStream().write(rresponse.body);
	}
}

/**
 * @namespace Agrupa funcionalidades relativas a comunica&ccedil;&atilde;o http
 *            entre o browser e o servidor.
 */
var http = {
	/**
	 * Executa o <i>parse</i> dos par&acirc;metros passados pelo client web
	 * para o servidor.
	 * 
	 * @param {string}
	 *            strParams A string contendo linha com os par&acirc;metros
	 *            recebidos pelo servidor.
	 * @returns {Object}
	 */
	parseParams: function(strParams) { 
		var params = {};
		
		function parseKey(skey, value) { 
			var patt = /\w+|\[\w*\]/g; 
			var k, ko, key = patt.exec(skey)[0]; 
			var p = params; 
			while ((ko = patt.exec(skey)) != null) { 
				k = ko.toString().replace(/\[|\]/g,""); 
				var m = k.match(/\d+/gi); 
				if ((m != null && m.toString().length == k.length) || ko == "[]") { 
					k = parseInt(k); 
					p[key] = p[key] || []; 
				} else { 
					p[key] = p[key] || {}; 
				} 
				p = p[key]; 
				key = k; 
			} 
			value = value	.replace(/\+/g, ' ')
							.replace(/%3A/g,":")
							.replace(/%2C/g,",")
							.replace(/%2B/g,"+")
							.replace(/%25/g,'%')
							.replace(/%3D/g,'=')
							.replace(/%2F/g,'/')
							.replace(/%40/g,'@')
							.replace(/%23/g,'#')
							.replace(/%3F/g,'?');
			if (typeof(key) == "number" && isNaN(key))
				p.push(value);
			else
				p[key] = value;
		}
		
		function parseParam(sparam) { 
			// var [key,value] = sparam.split('=');
			// parseKey(key, value);
			var vpar = sparam.split('=');
			parseKey(vpar[0], vpar[1]);
		} 
		
		if (strParams != null && strParams != "") {
			// var arrParams = strParams.replace(/%5B/g, "[").replace(/%5D/g, "]").split('&');
			var arrParams = new String(strParams).replace(/%5B/g, "[").replace(/%5D/g, "]").split('&'); 
		
			for (var i=0; i < arrParams.length; i++) { 
				parseParam(arrParams[i]); 
			} 
		}

		return params; 
	},

        response: {
                out : new String(),
                headers : {},
                contentLength : null,
                "content-type" : "text/html",
                getContentType : function() {
                        return this["content-type"];
                },
                setContentType : function(type) {
                        this["content-type"] = type;
                },
                write : function(content) {
                        this.out += content;
                        return this;
                },
                setOut : function(content) {
                        this.out = content;
                        return this;
                },
                toBytes : function() {
                        return new java.lang.String(this.out).getBytes();
                },
                toString : function() {
                        return this.out;
                },
                addHeader : function(name, value) {
                        this.headers[name] = value;
                },
                setContentLength : function(contentLength) {
                        this.contentLength = contentLength;
                }
        },
                        
        uploadFile: function(path, fileName) { 
		var contentType = global.request.getContentType();
		
		/* Excluido para comtemplar envio de imagens via AJAX */
		/*if ((contentType != null) && (contentType.indexOf("multipart/form-data") >= 0)) {*/
			var fin = new java.io.DataInputStream(global.request.getInputStream());
			var formDataLength = global.request.getContentLength();
			// byte dataBytes[] = new byte[formDataLength];
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
			var ext = new String(saveFile).replace(/.*?(\.\w+)$/gi, "$1");
			var ff = new java.io.File(path + ((fileName != undefined)? (fileName + ext) : saveFile));
			
			var fileOut = new java.io.FileOutputStream(ff);
			fileOut.write(dataBytes, startPos, (endPos - startPos));
			fileOut.flush();
			fileOut.close();
		/*}*/
	}
}; /* End namespace http */


var utils = {
		getRealPath: function(filePath) {
			return global.request.getServletContext().getRealPath(filePath);
		},
		getRealPathContext: function() {
			return global.request.getServletContext().getRealPath("");
		},
		getContextName: function() { 
			return global.request.getContextPath();
		}
};


print("platform.js loaded..............................................................");

/*

Router.add("/lixo", "/hello");
//Router.get("/(\\w+)/(\\d+)", function(request, response, paramsObject) {
//    console.log("1.Route OK");
//});
//Router.get("/:coll/:id", function(paramsObject, request, response) {
//    console.log("1.Route OK");
//});
//Router.process("GET", "usuarios/123");
Router.get("/:coll/:id", "hello/echo");

 */
