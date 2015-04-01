# Tutorial Leil�o boxJS

Uma das formas mais comum de n�s, programadores, aprendermos a programar em uma nova linguagem ou com um novo framework, � usando-o para desenvolver
alguma aplica��o, ent�o, para fixar o que foi ensinado sobre o boxJS at� o momento, propomos a constru��o de uma simples aplica��o web de leil�es online.


## Sum�rio

* [Antes de come�ar](#antes-de-come%C3%A7ar)
  * [Bootstrap e AngularJS](#bootstrap-e-angularjs)
  * [Front End](#front-end)
* [Back End com boxJS](#back-end-com-boxjs)
  * [`routes.js`](#routesjs) 
  * [`leilao.js` e `usuario.js`](#leilaojs-e-usuariojs)
    * [leilao/inserir](#leilaoinserir)
    * [leilao/buscar](#leilaobuscar)
    * [leilao/darlance](#leilaodarlance)
    * [leilao/fechar](#leilaofechar)
    * [usuario/tela](#usuariotela)
    * [usuario/inserir](#usuarioinserir)
    * [usuario/buscar](#usuariobuscar)
  * [`svr.js`](#svrjs)
  * [`security.js`](#securityjs)

## Antes de come�ar

### Bootstrap e AngularJS

� interessante que, antes de come�armos, voc� tenha tudo instalado e esteja familiarizado com as outras ferramentas que utilizaremos, s�o elas:

* [Bootstrap](http://getbootstrap.com/)
* [AngularJS](https://angularjs.org/)

Apesar dessas ferramentas serem amplamente usadas neste tutorial para desenvolver o front end, acreditamos que seja p�ssivel segu�-lo apenas com um 
conhecimento b�sico delas.


### Front End

Como nosso objetivo � focar no aprendizado do boxJS, a parte front end do nosso leil�o j� est� pronta para download [clicando aqui](https://github.com/cneryjr/boxjs/blob/master/tutorial/leilaoBoxJS.rar), 
mas voc� esta livre caso prefira implement�-la, apenas certifique-se que o front end esteja utilizando corretamente o boxJS (para isso recomendamos que voc� fa�a o 
download e veja como n�s acessamos o back end).


## Back End com boxJS

Nosso tutorial come�a, de fato, a partir de agora, mas consideramos que voc� seguiu e [leu todos os passos at� aqui](https://github.com/cneryjr/boxjs/blob/master/README.md) e que j� est� com seu 
[front end pronto e o boxJS funcionando, com alguns setups b�sicos](#front-end), conforme ensinado nos tutoriais anteriores.

### `routes.js`

O nosso primeiro passo � arrumar as rotas. Conforme podemos ver no nosso servi�o de acesso ao banco abaixo, nossa aplica��o espera acessar as urls `boxjs/leilao/inserir`, `boxjs/leilao/buscar`, 
`boxjs/leilao/darlance`, `boxjs/leilao/fechar`, `boxjs/usuario/tela`, `boxjs/usuario/buscar`, `boxjs/usuario/inserir`.



~~~ javascript

leilaoApp.factory("databaseSvc", ['$http','$q', function ($http,$q) {
	return {
		leilao: {
			insereLeilao: function (doc) {
			    return $http.post("boxjs/leilao/inserir", {docToInsert: doc});
			},
			buscaLeilao: function (busca, campos) {
				return $http.post("boxjs/leilao/buscar", { query: busca, fields: campos});
			},
			darLance: function (identificador, lanceAdicionado) {
				return $http.post("boxjs/leilao/darlance", { id: identificador, lance: lanceAdicionado});
			},
			fecharLeilao: function (identificador) {
				return $http.post("boxjs/leilao/fechar", { id: identificador });
			}
		},
		usuario: {
			tela: function() {
				return $http.post("boxjs/usuario/tela", {});
			},
			buscaUsuario: function (busca, campos) {
				return $http.post("boxjs/usuario/buscar", { query: busca, fields: campos});
			},
			insereUsuario: function (doc) {
			    return $http.post("boxjs/usuario/inserir", {docToInsert: doc});
			}
		}
	};
}]);

~~~


Al�m disso, o servi�o de autentica��o, conforme o c�digo abaixo, espera acessar a url `boxjs/svr/login`.


~~~ javascript

leilaoApp.factory("authenticationSvc", ['$http','$q','$window','userInfoFac',function($http, $q, $window,userInfoFac) {

	function setCookie(key, value, tempoParaExpirarMinutos) {
        var mins = tempoParaExpirarMinutos;
        if (isNaN(mins)) {
            mins = 60;
        }
        var now = new Date();
        var exp = new Date(now.getTime() + mins*mins*1000);
        var status = '';
        $window.document.cookie = key + '=' + value + '; expires='+exp.toUTCString();
    }
    
    function deleteCookie(key) {
        $window.document.cookie = key + '=' + "; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }
 
    function login(userName, password) {
		deleteCookie("userInfo");
	    var deferred = $q.defer();
	    $http.post("boxjs/svr/login", {
	        user: userName,
	        pass: $.md5(password)
	    }).then(function(result) {
	    	if(result.status != 200) {
	    		deferred.reject(result.data.reason);
	    	}
	        userInfo = {
	            accessToken: result.data.accessToken,
	            userName: result.data.userName,
	            timestamp: result.data.timestamp
	        };
	        userInfoFac.setUserInfo(userInfo);
	        setCookie("userInfo", JSON.stringify(userInfo));
	        deferred.resolve(userInfo);
	    }, function(error) {
	        deferred.reject(error);
	    });
	    return deferred.promise;
    }
	
	return {
		setCookie: setCookie,
		deleteCookie: deleteCookie,
		login: login		
	};
}]);

~~~


Uma vez que j� sabemos as URLs que ser�o acessadas, podemos criar as rotas, j� que n�o � considerada uma boa pr�tica deixar os arquivos no diret�rio inicial do boxJS. Usaremos, ent�o, a 
pasta `actions` para colocar o que ser� executado pelo boxJS, o primeiro passo � criar os tr�s arquivos, `usuario.js`, `leilao.js`, `svr.js` (sim, esses arquivos permanecem vazios, por enquanto,
pois os implanteremos mais tarde!), dentro desta pasta. Com isso feito podemos, finalmente, configurar nossas rotas, � importante lembrar que isso � feito dentro do arquivo `routes.js` que se 
encontra dentro da pasta `modules` e que a adi��o de uma rota segue o padr�o `Router.add( 'nomeDaURL', 'caminho/para/o/arquivo')`, deixando nosso arquivo `routes.js` da seguinte forma:

~~~ javascript

Router.add( 'usuario', 'actions/usuario');

Router.add( 'leilao', 'actions/leilao');

Router.add( 'svr', 'actions/svr');

~~~


### `leilao.js` e `usuario.js`

O primeiro passo parar implementar estes dois arquivos � saber quais ser�o os seus m�todos, conforme vimos na cria��o do `routes.js`, o front end ir� acessar as URLs: `boxjs/leilao/inserir`, `boxjs/leilao/buscar`, 
`boxjs/leilao/darlance`, `boxjs/leilao/fechar`, `boxjs/usuario/tela`, `boxjs/usuario/buscar`, `boxjs/usuario/inserir`. Logo, nossos m�todos s�o:

* leilao
  * [inserir](#leilaoinserir)
  * [buscar](#leilaobuscar)
  * [darlance](#leilaodarlance)
  * [fechar](#leilaofechar)
* usuario
  * [tela](#usuariotela)
  * [buscar](#usuariobuscar)
  * [inserir](#usuarioinserir)



#### leilao/inserir

Objetivo: Inserir um novo leil�o no banco.

Par�metros: Leil�o a ser inserido.

Retorna: Informa se a inser��o falhou ou n�o.

Regras de neg�cio:

- Status do novo leil�o deve ser 'aberto'.

- Lista de lances deve estar vazia.

- O ID deve ser incremental.

C�digo:

~~~ javascript
inserir: function (params,request,response) {
	var colLeilao = db.leilaobox().getCollection("leiloes");
	var newLeil = params.docToInsert;
	newLeil.status = "aberto";
	newLeil.lances = [];
	newLeil._id = db.leilaobox().eval("getNextSequence('leilaoid')");
	var insrt = colLeilao.insert(newLeil);
	print("-- inserted leilao.js [finished] --------------------------------------------");
	response.setStatus(200);
	response.write(JSON.stringify({error: false, data: insrt}));
}
~~~

OBS: Para que o ID seja incremental adicionamos a fun��o getNextSequence(name) ao banco que usa o comando findAndModify para incrementar o id de forma at�mica.

~~~ javascript
function getNextSequence(name) {
   var ret = db.counters.findAndModify(
          {
            "query": { "_id": name },
            "update": { $inc: { "seq": 1 } },
            "new": true
          }
   );

   return ret.seq;
}
~~~



#### leilao/buscar

Objetivo: Buscar leil�es do banco.

Par�metros: Query a ser executada e campos a serem retornado.

Retorna: Array de leil�es resultantes da execu��o da query com os campos especificados.

C�digo:

~~~ javascript
buscar: function (params,request,response) {
	var colLeilao = db.leilaobox().getCollection("leiloes");
	var search = colLeilao.find(params.query,params.fields);
	print("-- search leilao.js [finished] --------------------------------------------");
	response.setStatus(200);
	response.write(JSON.stringify({error: false, data: search.toArray()}));
}
~~~


#### leilao/darlance

Objetivo: Adicionar um lance a um leil�o do banco.

Par�metros: ID do leil�o que receber� o lance e o lance.

Retorna: Informa se a adi��o do lance falhou ou n�o.

Regras de neg�cio:

- Para um lance ser aceito ele deve ser maior que o m�nimo e maior que o lance anterior, caso ele exista.

C�digo:

~~~ javascript
darlance: function (params,request,response) {
	var colLeilao = db.leilaobox().getCollection("leiloes");
	var search = colLeilao.find({ "_id": params.id });
	var leilaoToLance = search.next();
	if( params.lance.valor < leilaoToLance.lanceInicial || ( leilaoToLance.ultimoLance && leilaoToLance.ultimoLance > params.lance.valor ) ) {
		response.setStatus(400);
		print("-- failed dar lance leilao.js [finished] --------------------------------------------");
		response.write(JSON.stringify({error: true, data: "Lance abaixo do minimo."}));
		return;
}
	var upd = colLeilao.update( { "_id": params.id } , { "$push": { "lances": params.lance }, "$set": { "ultimoLance": params.lance.valor } });
	print("-- dar lance leilao.js [finished] --------------------------------------------");
	response.setStatus(200);
	response.write(JSON.stringify({error: false, data: upd}));
},
~~~



#### leilao/fechar

Objetivo: Fechar um leil�o do banco.

Par�metros: ID do leil�o a ser fechado.

Retorna: Leil�o fechado, caso o fechamento ocorra.

Regras de neg�cio:

- Testar se existe um leil�o com o ID indicado.

- Colocar no leil�o os dados do lance vencedor.

- Mudar o status do leil�o para 'fechado'.


C�digo:

~~~ javascript
fechar: function (params,request,response) {
	var colLeilao = db.leilaobox().getCollection("leiloes");
	var search = colLeilao.find({ "_id": params.id });
	if(!search.hasNext()) {
		response.setStatus(400);
		print("-- failed close leilao.js [finished] --------------------------------------------");
		response.write(JSON.stringify({error: true, data: "Nao ha leiloes com este ID"}));
		return;
	}
	var leilaoFechar = search.next();
	var lanceGanhador = leilaoFechar.lances[leilaoFechar.lances.length-1];
	leilaoFechar.vencedor = lanceGanhador.usuario;
	leilaoFechar.status = "fechado";
	var upd = colLeilao.update( { "_id": params.id } , leilaoFechar );
	print("-- closed leilao.js [finished] --------------------------------------------");
	response.setStatus(200);
	response.write(JSON.stringify({error: false, data: leilaoFechar}));
}
~~~




#### usuario/tela

Objetivo: Verificar se a tela de usuario pode ser acessada pelo usuario atual.

Retorna: Libera o acesso para a tela.

C�digo:

~~~ javascript
tela: function (params,request,response) {
	print("-- tela usuario.js [finished] --------------------------------------------");
	response.setStatus(200);
	response.write(JSON.stringify({error: false, data: "OK"}));
}
~~~

OBS: Este m�todo far� mais sentido quando o `security.js` for implementado.




#### usuario/inserir

Objetivo: Inserir um novo usu�rio ao banco.

Par�metros: Usu�rio a ser inserido.

Retorna: Informa se a inser��o do usuario falhou ou n�o.

Regras de neg�cio:

- Setar o tipo do usu�rio para 'basic'.


C�digo:

~~~ javascript
inserir: function (params,request,response) {
	var colUsuario = db.leilaobox().getCollection("usuarios");
	var newUsr = params.docToInsert;
	newUsr.tipo = "basic";
	try {
		var insrt = colUsuario.insert(newUsr);
	} catch (e) {
		response.setStatus(400);
		print("-- failed insert usuario.js [finished] --------------------------------------------");
		response.write(JSON.stringify({error: true, data: e.toString()}));
		return;
	}
	print("-- inserted usuario.js [finished] --------------------------------------------");
	response.setStatus(200);
	response.write(JSON.stringify({error: false, data: insrt}));
}
~~~


#### usuario/buscar

Objetivo: Buscar usu�rios no banco.

Par�metros: Query a ser executada e campos a serem retornado.

Retorna: Array de usu�rios resultantes da execu��o da query com os campos especificados.

C�digo:

~~~ javascript
buscar: function (params,request,response) {
	var colUsuario = db.leilaobox().getCollection("usuarios");
	var search = colUsuario.find(params.query,params.fields);
	print("-- search usuario.js [finished] --------------------------------------------");
	response.setStatus(200);
	var resu = search.toArray();
	response.write(JSON.stringify({error: false, data: resu}));
}
~~~




Agora basta que juntemos todos esses m�todos em seus respectivos arquivos, utilizando um objeto exports:


~~~ javascript

//leilao.js

var colLeilao = db.leilaobox().getCollection("leiloes");

exports = {
	darlance: function (params,request,response) {
		var search = colLeilao.find({ "_id": params.id });
		var leilaoToLance = search.next();
		if( params.lance.valor < leilaoToLance.lanceInicial || ( leilaoToLance.ultimoLance && leilaoToLance.ultimoLance > params.lance.valor ) ) {
			response.setStatus(400);
			print("-- failed dar lance leilao.js [finished] --------------------------------------------");
			response.write(JSON.stringify({error: true, data: "Lance abaixo do minimo."}));
			return;
    	}
		var upd = colLeilao.update( { "_id": params.id } , { "$push": { "lances": params.lance }, "$set": { "ultimoLance": params.lance.valor } });
		print("-- dar lance leilao.js [finished] --------------------------------------------");
		response.setStatus(200);
		response.write(JSON.stringify({error: false, data: upd}));
	},
	buscar: function (params,request,response) {
		var search = colLeilao.find(params.query,params.fields);
		print("-- search leilao.js [finished] --------------------------------------------");
		response.setStatus(200);
		response.write(JSON.stringify({error: false, data: search.toArray()}));
	},
	inserir: function (params,request,response) {
		var newLeil = params.docToInsert;
		newLeil.status = "aberto";
		newLeil.lances = [];
		newLeil._id = db.leilaobox().eval("getNextSequence('leilaoid')");
		var insrt = colLeilao.insert(newLeil);
		print("-- inserted leilao.js [finished] --------------------------------------------");
		response.setStatus(200);
		response.write(JSON.stringify({error: false, data: insrt}));
	},
	fechar: function (params,request,response) {
		var search = colLeilao.find({ "_id": params.id });
		if(!search.hasNext()) {
			response.setStatus(400);
			print("-- failed close leilao.js [finished] --------------------------------------------");
			response.write(JSON.stringify({error: true, data: "Nao ha leiloes com este ID"}));
			return;
		}
		var leilaoFechar = search.next();
		var lanceGanhador = leilaoFechar.lances[leilaoFechar.lances.length-1];
		leilaoFechar.vencedor = lanceGanhador.usuario;
		leilaoFechar.status = "fechado";
		var upd = colLeilao.update( { "_id": params.id } , leilaoFechar );
		print("-- closed leilao.js [finished] --------------------------------------------");
		response.setStatus(200);
		response.write(JSON.stringify({error: false, data: leilaoFechar}));
	}
}

~~~


~~~ javascript

//usuario.js

var colUsuario = db.leilaobox().getCollection("usuarios");

exports = {
	tela: function (params,request,response) {
		print("-- tela usuario.js [finished] --------------------------------------------");
		response.setStatus(200);
		response.write(JSON.stringify({error: false, data: "OK"}));
	},
	buscar: function (params,request,response) {
		var search = colUsuario.find(params.query,params.fields);
		print("-- search usuario.js [finished] --------------------------------------------");
		response.setStatus(200);
		var resu = search.toArray();
		response.write(JSON.stringify({error: false, data: resu}));
	},
	inserir: function (params,request,response) {
		var newUsr = params.docToInsert;
		newUsr.tipo = "basic";
		try {
			var insrt = colUsuario.insert(newUsr);
		} catch (e) {
			response.setStatus(400);
			print("-- failed insert usuario.js [finished] --------------------------------------------");
			response.write(JSON.stringify({error: true, data: e.toString()}));
			return;
		}
		print("-- inserted usuario.js [finished] --------------------------------------------");
		response.setStatus(200);
		response.write(JSON.stringify({error: false, data: insrt}));
	}
}

~~~

H� uma pequena diferen�a entre os c�digos de cada m�todo e o c�digo que os unifica. Como o acesso a collection a qual o arquivo � referente ser� feito por praticamente todos os seus m�todos
colocamos esse acesso fora de um m�todo especifico.


### `svr.js`

Conforme visto durante a cria��o do `routes.js`, este arquivo conter� apenas um m�todo, o login, que ser� usado para conferir a senha e o nome do usu�rio e, caso os dados sejam v�lidos, criar
um token de acesso para ele.

A primeira parte do nosso m�todo, ser�, ent�o, checar se o usu�rio e senha fornecidos s�o v�lidos e isso � feito facilmente, basta checar se h� uma entrada no banco com aquela senha 
e aquele nome de usu�rio, caso afirmativo, os dados s�o v�lidos e o usu�rio deve receber seu token de acesso.

O token de acesso pode ser feito de qualquer maneira, s� � importante que ele seja �nico para um usu�rio, n�o possa ser gerado por algum usu�rio mal intencionado e seja poss�vel
que o servidor cheque se um determinado token � de um determinado usu�rio. Para suprir todos estes pr�-requisitos, nosso token ser� a concatena��o do nome do usu�rio, tempo m�ximo de dura��o do token
e o tipo do usu�rio, tudo isso criptografado utilizando o AES e uma chave que � de conhecimento apenas do servidor.

Para utilizar o AES adicionaremos � pasta `modules` o arquivo [`aes.js`](http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js), e al�m de acrescentar esse novo m�dulo ao `config.js`,
colocaremos nele a chave de criptografia que ser� usada, deixando o nosso `config.js` da seguinte forma:

~~~ javascript

var config = {
		
    modules: ["routes", "mongodb", "init", "security","aes"],

    mongodb: {
        datasource: "java:comp/env/mongo/MongoDSFactory"
    },
    
    serverKey: "security_key"

};

~~~

Com o AES pronto para ser usado basta que codifiquemos o `svr.js` seguindo as ideias anteriormente mencionadas.

~~~ javascript

var colUsuario = db.leilaobox().getCollection("usuarios");

exports = {
	login: function (params,request,response) {
		var search = colUsuario.find( { "_id": params.user, "senha": params.pass } );
		if(search.hasNext()) {
			var newDateObj = (new Date()).getTime() + 30*60000; // token durar� por 30 minutos
			var token = params.user + "@" + newDateObj + '@' + search.next().tipo;
			var tokenToSend = (CryptoJS.AES.encrypt(token,config.serverKey)).toString();
			response.write(JSON.stringify({error: false, accessToken: tokenToSend, userName: params.user, timestamp: newDateObj }));
			response.setStatus(200);
			print("-- login done svr.js [finished] --------------------------------------------");
		}
		else {
			print("-- login failed svr.js [finished] --------------------------------------------");
			response.setStatus(401);
			response.write(JSON.stringify({error: true, reason: "Senha e/ou password inv�lido."}));
		}
	}
}

~~~


### `security.js`

Conforme vimos [anteriormente](https://github.com/cneryjr/boxjs/blob/master/README.md#utilizando-o-securityjs), o m�dulo de seguran�a constitui parte importante de uma aplica��o,
uma vez que � ele quem restringe os usu�rios a acessarem certas funcionalidades do nosso sistema. E, como no nosso leil�o existem dois tipos de
usu�rios (administrador, que cria e fecha leil�es, al�m de fazer o cadastro de usu�rios, e usu�rio padr�o, que apenas da lances), este tipo de
restri��o � de extrema import�ncia.

Pegando como base os m�todos desenvolvidos at� o momento e os 3 tipos de acesso (usu�rio administrador, usu�rio padr�o e visitante) com os quais podemos nos deparar, podemos 
definir como ser� nosso controle de acesso.


* Visitante
  * svr/login
* Padr�o
  * svr/login
  * leilao/darlance
  * leilao/buscar
  * usuario/buscar
* Administrador
  * svr/login
  * leilao/darlance
  * leilao/buscar
  * leilao/inserir
  * leilao/fechar
  * usuario/tela
  * usuario/buscar
  * usuario/inserir


Encaixando esse modelo nos 4 m�todos do security que v�m por padr�o com o boxJS, temos que:

- isUserLogged: Deve barrar qualquer acesso que n�o for ao `svr/login`, quando o usu�rio n�o esta logado.

- isSessionValid: N�o deve barrar em nenhum caso.

- hasPermissionInThisModule: N�o deve barrar em nenhum caso.

- hasPermissionInThisMethod: N�o deve barrar acesso ao `svr/login`. Deve barrar acesso aos m�todos `inserir`, `fechar` e `tela`, quando o usu�rio n�o for administrador.


O que deixa nosso `security.js` da seguinte forma:

~~~ javascript

var safe = safe || {};

safe.isItSafe = function (paramsObject, request, response) {
	
    var uri = new String(request.requestURI);

	var p = uri.split("/");
	var moduleName = p[p.length-2];
	var methodName = p[p.length-1];	

    return this.isUserLogged(paramsObject, request, response)
        && this.isSessionValid(paramsObject, request, response)
        && this.hasPermissionInThisModule(paramsObject, request, response, moduleName)
        && this.hasPermissionInThisMethod(paramsObject, request, response, methodName);
};

safe.isUserLogged = function(paramsObject, request, response) {

	if(request.pathInfo == "/svr/login") {
		http.response.setStatus(200);
		return true;
	}
	
	if(!http.requestJava.getHeader("Authorization")) {
		http.response.setStatus(401);
		return false;
	}
	
	var headerToken = http.requestJava.getHeader("Authorization").slice(6);
	
	if(headerToken.length == 0) {
		http.response.setStatus(401);
		return false;
	}
	
	var userAndToken = headerToken.split(" ");
	
	if(userAndToken.length != 2) {
		http.response.setStatus(401);
		return false;
	}
	
	var realToken = (CryptoJS.AES.decrypt(userAndToken[1],config.serverKey)).toString(CryptoJS.enc.Utf8);
	
	var tokenUserAndTimestampAndProfile = realToken.split("@");
	
	
	// testa se o usu�rio do token � igual ao usu�rio mandado no header e testa se o hor�rio agora j� ultrapassou o do permitido pelo token
	if(tokenUserAndTimestampAndProfile.length != 3 || tokenUserAndTimestampAndProfile[0] != userAndToken[0] || Number(tokenUserAndTimestampAndProfile[1]) < (new Date()).getTime()) {
		http.response.setStatus(401);
		return false;
	}
	
	http.response.setStatus(200);
	return true;
};

safe.isSessionValid = function (paramsObject, request, response) {

    return true;
};

safe.hasPermissionInThisModule = function (paramsObject, request, response, moduleName) {
	
    return true;
};

safe.hasPermissionInThisMethod = function (paramsObject, request, response, methodName) {
	
	if(request.pathInfo == "/svr/login") {
		http.response.setStatus(200);
		return true;
	}
	
	if(!http.requestJava.getHeader("Authorization")) {
		http.response.setStatus(401);
		return false;
	}
	
	var headerToken = http.requestJava.getHeader("Authorization").slice(6);
	
	var userAndToken = headerToken.split(" ");
	
	var realToken = (CryptoJS.AES.decrypt(userAndToken[1],config.serverKey)).toString(CryptoJS.enc.Utf8);
	
	var tokenUserAndTimestampAndProfile = realToken.split("@");
	
	var profile = tokenUserAndTimestampAndProfile[2];
	
	if((methodName == "fechar" || methodName == "inserir" || methodName == "tela") && profile != "admin") {
		http.response.setStatus(401);
		return false;
	}
	
    return true;
};

safe.onError = function (paramsObject, request, response) {
	response.setContentType("text/html");
	response.write("<H1>boxJS error: permission denied.</H1>");
};

print("security.js loaded ......................................................");

~~~

OBS: Vale lembrar que no front end enviamos, junto com todas requisi��es, um header chamado 'Authorization' que possui o tipo de autoriza��o, o nome do usu�rio e o token de acesso.
Esse header � usado pelo security para identificar o usu�rio e para conferir se o token de acesso � v�lido.