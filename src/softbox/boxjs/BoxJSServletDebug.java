package softbox.boxjs;

import java.io.IOException;
import javax.script.Bindings;
import javax.script.ScriptException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import jdk.nashorn.api.scripting.ScriptObjectMirror;


@WebServlet(
        name="boxjsdbg",
        loadOnStartup = 1,
        urlPatterns = "/boxjsdbg/*",
        initParams = {
            @WebInitParam(name = "configFile", value = "config.js")
        }
)
public class BoxJSServletDebug extends BoxJSServlet {

    private static final long serialVersionUID = -1L;

    @Override
    ScriptObjectMirror processRequest(ScriptObjectMirror paramsObject, Bindings req, ScriptObjectMirror res) throws IOException, ScriptException, NoSuchMethodException {

        ScriptObjectMirror resp = (ScriptObjectMirror)internal.callMember("procRequest", paramsObject, req, res);        
    
        return resp;
    }
    
}
