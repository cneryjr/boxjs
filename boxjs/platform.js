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

/** Controla cache dos scripts */
var scripts = {}; 


/**
 * Carrega um <tt>m&oacute;dulo</tt> Javascript disponibilizando no contexto somente as 
 * vari&aacute;veis e funções que foram exportadas.
 * @param {string} filename O nome do arquivo (m&oacute;dulo) a ser importado.
 * @returns {Object}
 */
function require(filename) {
	org.mozilla.javascript.ScriptableObject.putProperty(scope, "exports", {});
	return servlet.require(filename);
}

function load(filename) {
    if (!scripts[filename]) {
        //scripts[filename] = true;
    	org.mozilla.javascript.ScriptableObject.putProperty(scope, "exports", {});
        return servlet.runScript(config.applicationRoot + filename, global.request, global.scope);
    }
}

function print() {
	var args = Array.apply(null, arguments);
	java.lang.System.out.println(args.join(""));
}

var console = {
		log: print
};

function service(request, response) {
	var qryString = null;

	if (!(request.getContentType() != null && request.getContentType().startsWith("multipart/form-data"))) {
		// print("\nContentType: " + request.getContentType() + " ....................................\n");
		qryString = request.getReader().readLine();
		qryString = (qryString == null || qryString.equals("")) ? request
				.getQueryString() : qryString;
	}

	var rrequest = {
		version : [ 1, 1 ], /* parsed HTTP version ~ "HTTP/1.1" */
		method : request.getMethod(),
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
			"if-modified-since" : request.getHeader("if-modified-since") || "Fri, 28 Sep 2012 13:37:50 GMT",
			"cache-control" : "max-age=0"
		},
		/* input: request.getInputStream(), *//* request body stream */
		scheme : request.getScheme(),
		host : request.getServerName() || "boxjs.com.br",
		port : request.getServerPort(),
		scriptName : "",
		pathInfo : request.getPathInfo(),
		env : global = { /* this is the place where Server and Middleware put keys */
			boxjs : {
				version : [ 0, 1 ],
				session: request.getSession(),
				servlet: servlet,
				request: request,
				response: response
			},
			session : request.getSession(),
			contextPath : new String(request.getServletContext()
					.getContextPath()),
			scope : scope,
			jscontext : jscontext,
			request : request,
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
		response.setHeader(key, rresponse.headers[key]);
	}

	if (rresponse.contentLength != null) {
		response.setContentLength(rresponse.contentLength);
	}

	//if (rresponse.headers["content-type"] == "text/html") {
	if (["text/html", "text/xml", "text/plain", "text/javascript", "application/json"].indexOf(rresponse.headers["content-type"]) >= 0) {
		response.getWriter().println(rresponse.body.join(""));
	} else {
		response.getOutputStream().write(rresponse.body);
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
			var patt = /\w+|\[\w+\]/g; 
			var k, key = patt.exec(skey)[0]; 
			var p = params; 
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
		generateReport: function(type, path, parameters) {       
	        var maps = new java.util.ArrayList(); 
	        for(var x =0; x < parameters.length; x++) {
	                var dm = new java.util.HashMap();       
	                for(var key in parameters[x]) {
	                        dm.put(key,parameters[x][key]);
	                }                       
	                maps.add(dm);
	        }

	        var jasperReport = net.sf.jasperreports.engine.util.JRLoader.loadObjectFromFile(path);  
	        var dataSource = new net.sf.jasperreports.engine.data.JRMapCollectionDataSource(maps);  
	        var jasperPrint = net.sf.jasperreports.engine.JasperFillManager.fillReport(jasperReport, new Packages.java.util.HashMap() ,dataSource); 
	        
	        var exporter, outreport = new java.io.ByteArrayOutputStream();
	        
	        if(type == "pdf") {
	                exporter = new net.sf.jasperreports.engine.export.JRPdfExporter();
	        } else if (type = "xls"){
	                exporter = new net.sf.jasperreports.engine.export.JRXlsExporter();
	                exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_DETECT_CELL_TYPE,java.lang.Boolean.TRUE);  
	                exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS,java.lang.Boolean.TRUE);  
	                exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, java.lang.Boolean.TRUE);  
	                exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.MAXIMUM_ROWS_PER_SHEET,java.lang.Integer.decode("65000"));  
	                exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_DETECT_CELL_TYPE, java.lang.Boolean.TRUE);  
	                exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_WHITE_PAGE_BACKGROUND, java.lang.Boolean.FALSE);  
	                exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, java.lang.Boolean.TRUE);
	        } else {
	                return {error : true, message: "Type not suported"};
	        }       

	        exporter.setParameter(net.sf.jasperreports.engine.JRExporterParameter.JASPER_PRINT, jasperPrint);       
	        exporter.setParameter(net.sf.jasperreports.engine.JRExporterParameter.OUTPUT_STREAM, outreport);        
	        exporter.exportReport();        
	        
	        var bytes = outreport.toByteArray();
	        outreport.close();              
	        
	        return {type : "report", bytes : bytes};                
	}		
};

print("boxjsServlet.js loaded...........................................");
