package softbox.boxjs;

import javax.script.Bindings;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

/**
 *
 * @author Nery Jr
 */
public class Debug {

    static public ScriptObjectMirror debug(ScriptObjectMirror internal, String method, ScriptObjectMirror paramsObject, Bindings req, ScriptObjectMirror res) {
        return (ScriptObjectMirror)internal.callMember("procRequest", paramsObject, req, res);   
    }
    
}
