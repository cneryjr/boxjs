package softbox.boxjs;

import java.io.IOException;
import javax.script.Bindings;
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
    void processRequest(ScriptObjectMirror paramsObject, Bindings req, ScriptObjectMirror res) {
        router.callMember("process", req.get("method"), req.get("rest"), paramsObject, req, res);    
    }
    
}
