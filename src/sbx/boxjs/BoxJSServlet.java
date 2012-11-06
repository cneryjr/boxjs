package sbx.boxjs;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.GenericServlet;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;


public class BoxJSServlet extends GenericServlet {
	private static final long serialVersionUID = -1L;
    private static final Logger log = Logger.getLogger(BoxJSServlet.class.getName());
	Scriptable rootScope;
	Function service;
	
	@Override
	public void service(ServletRequest rrequest, ServletResponse rresponse)
			throws ServletException, IOException {
		HttpServletRequest request = (HttpServletRequest) rrequest;
		HttpServletResponse response = (HttpServletResponse) rresponse;
		Scriptable scope;

		//System.out.println("global: " + rootScope.get("global", rootScope));
		try {
			Context jcx = ContextFactory.getGlobal().enterContext();
			synchronized (rootScope) {
				scope = jcx.newObject(rootScope);
				scope.setPrototype(rootScope);
			}
			ScriptableObject.putProperty(scope, "scope", Context.javaToJS(scope, scope));
			ScriptableObject.putProperty(scope, "jscontext", Context.javaToJS(jcx, scope));
			Object functionArgs[] = { request, response };
			service.call(jcx, scope, scope, functionArgs);
		} catch (Exception e) {
			response.getWriter().println(
					"<html><body><b>Servlet Error (" + e.getClass()
							+ ")</b><xmp>" + e.getMessage()
							+ "</xmp></body></html>");
			log.severe("Servlet Error (" + e.getClass() + ")" + e.getMessage() + "\nuri: " + request.getRequestURI());
		} finally {
			Context.exit();
		}
	}
	
	public Object require(Object fileName) { 
		String filename = fileName.toString();

		try {
			Context cx = org.mozilla.javascript.ContextFactory.getGlobal().enterContext();
			Scriptable newScope = cx.newObject(rootScope);
		    newScope.setPrototype(rootScope);
			ScriptableObject.putProperty(newScope, "scope", newScope);
			ScriptableObject.putProperty(newScope, "jscontext", cx);

			Object config = org.mozilla.javascript.ScriptableObject.getProperty(rootScope, "config");
			String applicationRoot = (String) ((ScriptableObject)config).get("applicationRoot", rootScope);
			evaluateJavascriptFile(cx, newScope, applicationRoot + filename);
			return org.mozilla.javascript.ScriptableObject.getProperty(newScope, "exports");
		} catch (Exception e) {
			System.out.println("Error: " + e.getMessage());
		} finally {
			Context.exit();
		}
		return null;
	}

	public Object evaluateJavascriptFile(Context ctx, Scriptable scope, String path) throws FileNotFoundException, IOException {
		String filename = this.getServletConfig().getServletContext().getRealPath("/WEB-INF/boxjs" + path);
		String srcName = filename.replaceAll(".*?\\\\(\\w+\\.\\w+)", " $1");
		FileReader rd = null;
		Object r = null;
		
		if (new File(filename).exists())
			r = ctx.evaluateReader(scope, rd = new FileReader(filename), srcName, 1, null);
		if (rd != null)
			rd.close();
		return r;
	}

	@Override
	public void init() throws ServletException {
    	log.info("boxJS initializing ...\n");

		Context ctx = ContextFactory.getGlobal().enterContext();
		rootScope = ctx.initStandardObjects();
		
	    ScriptableObject.putProperty(rootScope, "servlet", Context.javaToJS(this, rootScope));		
	    ScriptableObject.putProperty(rootScope, "jscontext", Context.javaToJS(ctx, rootScope));
	    ScriptableObject.putProperty(rootScope, "rootScope", Context.javaToJS(rootScope, rootScope));		
	    ScriptableObject.putProperty(rootScope, "scope", Context.javaToJS(rootScope, rootScope));		
	    ScriptableObject.putProperty(rootScope, "log", Context.javaToJS(log, rootScope));
	    /*ScriptableObject.putProperty(rootScope, "servletConfig", Context.javaToJS(this.getServletConfig(), rootScope));	*/
	    
	    try {
	    	log.info("loading config.js ...");
			evaluateJavascriptFile(ctx, rootScope, "/config.js");
			
	    	log.info("loading boxjsServlet.js ...");
	    	evaluateJavascriptFile(ctx, rootScope, "/boxjsServlet.js");
		    service = (Function)rootScope.get("service", rootScope);
			
	    	log.info("loading database.js ...");
			evaluateJavascriptFile(ctx, rootScope, "/modules/database.js");
			
	    	log.info("loading application.js ...");
			@SuppressWarnings("rawtypes")
			String appPath = (String)((Map)rootScope.get("config", rootScope)).get("entryPoint");
			appPath = (appPath == null || appPath.isEmpty())? "/application.js" : appPath;
			evaluateJavascriptFile(ctx, rootScope, "" + appPath);
	    	log.info(".js files loaded.");	    	
	    } catch (Exception e) {
			OutputStream out = new ByteArrayOutputStream();
			e.printStackTrace(new PrintStream(out));
	    	log.severe(e.getMessage() + ": \n" + out.toString());
			e.printStackTrace();
		} finally {
			Context.exit();
		}
    	log.info("boxJS initialed!\n=========================================================================================\n");	    
	}

	@Override
	protected void finalize() throws Throwable {
		System.out.println("init .......................................................\n");
		Context.exit();
	}
}
