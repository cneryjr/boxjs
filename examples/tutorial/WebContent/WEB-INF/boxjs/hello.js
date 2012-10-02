var response = global.response;
var msg = " xxx ", x = {nome: "Pedro Paulo", idade: 8, cidade: "Uberlandia"};
var qrys = parseParams(global.queryString);


print(JSON.stringify(qrys));

response.write("<html> <head><title>abc</title></head> <body> <h1> Hello at "
    + new Date() + " from " + global.request.getServletPath() 
    + " </h1> <hr>" + JSON.stringify(x) + "<br>" + /*param.nome +*/ "<hr> </body> </html>");
