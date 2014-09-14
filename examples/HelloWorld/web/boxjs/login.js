// http://localhost:8080/boxjs/boxjs/login.js?nomusr=nery&snhusr=827ccb0eea8a706c4c34a16891f84e7b

var resp = http.response;

var row = http.parseParams(http.request.queryString);
//var row = {login: true, page: "principal.html"};

var sql = "SELECT * from tusuario where nomusr = '" + row.nomusr + "' and snhusr = '" + row.snhusr + "'";

//rs = '{"login":true,"page":"principal.html"}'
//resp.setContentType("application/json");
//resp.write( JSON.stringify(rs) );


var rs = db.Table.execute(sql);
if (rs.length > 0) {
    rs = {login: true, page: "principal.html"};
} else {
    rs = {login: false, page: "index.html"};
};   

resp.setContentType("application/json");
resp.write( JSON.stringify(rs) );

//global.boxjs.response.sendRedirect("/boxjs/form.jsp");
