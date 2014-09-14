var response = global.response;

var msg = " xxx ", x = {nome: "Pedro Paulo", idade: 8, cidade: "Uberlandia"};

//print(JSON.stringify(qrys));

/*response.write("<html> <head><title>abc</title></head> <body> <h1> Hello at "
    + new Date() + " from " + global.request.getServletPath() 
    + " </h1> <hr>" + JSON.stringify(x) + "<br>" + param.nome + "<hr> </body> </html>");*/

function geral() {
	print("1.geral..........");
};

exports.geral = geral;

exports.actions = {

		test: function(params, request) {
			print("Running actions.test");
			response.write("Running actions.test<br>");
			response.write("Params: " + JSON.stringify(params));
		}
};

print("actions.js loaded! ..............................................");