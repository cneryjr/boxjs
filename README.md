# boxJS

O boxJS � um container de execu��o JavaScript para servidores Web, 
ou seja, � uma plataforma Server-Side JavaScript(SSJS).


## Primeiros Passos

Depois de [configurar o seu ambiente para o funcionamento do boxJS](#configurando-o-ambiente-de-desenvolvimento), j� podemos criar 
nosso primeiro arquivo javascript que ser� executado pelo servidor. Podemos cham�-lo de 'hello.js' e escreveremos apenas o seguinte c�digo nele:

~~~ javascript

exports = {
	world: function (params,request,response) {
		response.write("<html><body> <h1>Hello world!</h1> </body></html>");
	}
}

~~~


Agora, j� podemos acessar nossa primeira p�gina fornecida via boxJS atrav�s da seguinte URL `localhost:8080/<nome_do_projeto>/boxjs/hello/world`.

![Browser](imagens/browser_com_primeira_pagina.png)

## Precisando de Ajuda?

Envie-nos um [e-mail](mailto:suporteboxjs@softbox.com.br)

Fa�a perguntas no Stackoverflow usando a [tag boxJS](http://pt.stackoverflow.com/questions/tagged/boxjs)


## Vantagens

* SSJS baseado em threads
* Perform�tico
* F�cil aprendizado
* Simples de usar
* Bom conjunto de APIs para utiliza��o imediata
* 'Handler' �nico que trata todas as requisi��es vindas do cliente web (browser)

## Sum�rio


* [Configurando o ambiente de desenvolvimento](#configurando-o-ambiente-de-desenvolvimento)
* [Configurando o `config.js`](#configurando-o-configjs)
* [Configurando rotas](#configurando-rotas)
* [Utilizando o `security.js`](#utilizando-o-securityjs)
* [MongoDB](#mongodb)
  * [Preparando para usar o MongoDB](#preparando-para-usar-o-mongodb)
  * [Usando o MongoDB](#usando-o-mongodb)

## Configurando o ambiente de desenvolvimento


Para come�armos a trabalhar com o boxJS precisamos, antes de mais nada, fazer algumas configura��es no nosso ambiente de 
desenvolvimento. Come�amos criando um Dynamic Web Project:

![Criando projeto](imagens/fistProject/criando_projeto1.png)

![Criando projeto](imagens/fistProject/criando_projeto2.png)

Neste passo � importante checar se o Tomcat esta selecionado e clicar para ir para o pr�ximo, ao inv�s de finalizar, conforme 
imagem abaixo:

![Configuracao novo projeto](imagens/fistProject/criando_projeto3.png)

Nesta tela n�o h� necessidade de modificar nada, apenas siga para a pr�xima.

![Configuracao novo projeto](imagens/fistProject/criando_projeto4.png)

Nesta parte � importante marcar a op��o de gerar o web.xml automaticamente, conforme imagem abaixo:

![Configuracao novo projeto](imagens/fistProject/criando_projeto5.png)

Pronto, temos nosso primeiro projeto criado, por�m o boxJS ainda n�o funcionar�, precisamos fazer apenas mais uma configura��o.

Adicionaremos � pasta `lib`, que est� dentro da pasta `WEB-INF`, que, por sua vez, est� dentro da pasta `WebContent`, o [jar do boxJS](https://github.com/cneryjr/boxjs/blob/master/lib/boxjs.jar?raw=true),
do [Tomcat](https://github.com/cneryjr/boxjs/blob/master/lib/tomcat-jdbc.jar?raw=true) e da [api de servlet](https://github.com/cneryjr/boxjs/blob/master/lib/servlet-api-3.0.jar?raw=true), conforme imagem abaixo:

![Jars na pasta lib](imagens/fistProject/criando_projeto6.png)



Feito isso, basta que adicionemos nosso novo projeto ao Tomcat, conforme as imagens abaixo:

![Adicionando projeto ao servidor](imagens/fistProject/criando_projeto7.png)

![Adicionando projeto ao servidor](imagens/fistProject/criando_projeto8.png)

� importante lembrar que todos os arquivos `.js` devem estar dentro da pasta boxjs ou algum subdiret�rio, conforme a 
imagem abaixo.


![Hello World](imagens/hello_dentro_boxjs.png)


Pronto, nosso ambiente j� est� completamente pronto para funcionar o boxJS!


## Configurando o `config.js`

Voce pode ter reparado que o servidor encontrou alguns erros ao subir nosso primeiro projeto, isso aconteceu pois
toda vez que o boxJS � instanciado ele procura pelo arquivo `config.js` dentro da pasta `boxjs`, este arquivo
cont�m configura��es a serem executadas assim que o box � instanciado.

Um exemplo do que � poss�vel fazer com essas configura��es � a inclus�o de m�dulos, que devem seguir o seguinte
padr�o.

~~~ javascript

var config = {
	modules: ["routes", "mongodb", "io", "binary", "jsrender","init"]
};

~~~


Para alguns m�dulos, como por exemplo o mongodb, � necess�rio que se inclua mais algumas configura��es. No caso
do mongo, � necess�rio citar o link com o banco, o que deve deixar nosso `config.js` da seguinte forma:


~~~ javascript

var config = {
	modules: ["routes", "mongodb", "io", "binary", "jsrender","init"],
	
	mongodb: {
		datasource: "java:comp/env/mongo/MongoDSFactory"
	}	
};

~~~

OBS: Al�m disso, para utilizarmos o mongo � necess�rio criar o datasource no context.xml, isso pode ser feito 
adicionando a seguite tag (com suas devidas altera��es) ao context.xml do Tomcat que rodar� seu projeto.

~~~ xml
<Resource name="mongo/MongoDSFactory" auth="Container"
type="com.mongodb.MongoClient" factory="softbox.boxjs.MongoDSFactory"
singleton="false" user="" pass="" uri="mongodb://localhost:27017/nome_do_banco"/>

~~~









## Configurando rotas

Al�m das p�ginas html que est�o na pasta `WebContent` que s�o fornecidas normalmente pelo Tomcat, j� sabemos que � possivel
fornecer p�ginas atrav�s de comandos Javascript desde que os arquivos com estes comandos estejam dentro da pasta `boxjs`. 
Outra possibilidade que o boxJS traz � o uso de rotas, essas rotas podem ser definidas no arquivo `config.js`, do qual [j� 
falamos anteriormente](#configurando-o-configjs), ou em um outro arquivo qualquer, desde que este seja adicionado como 
m�dulo no `config.js`. Consideramos o segundo modo o mais correto e � ele que pode ser encontrado no exemplo abaixo:

Primeiro devemos criar nosso arquivo `config.js`, nele incluiremos apenas o nosso m�dulo `routes`:

~~~ javascript

var config = {
	modules: ["routes"]
};

~~~

![Configjs](imagens/img-config-js-na-pasta.png)


Agora podemos criar o arquivo `routes.js` que ir� conter nossas rotas:


~~~ javascript

Router.add( 'hello', 'actions/hello');

Router.add( 'bye', 'actions/bye');

~~~

![Routesjs](imagens/img-routes-js-na-pasta.png)

Os argumentos da fun��o add, usada acima, s�o, respectivamente, o Url pattern daquela rota e o arquivo JS que responder� �s requisi��es que
chegarem nela (o caminho deste arquivo � apartir da pasta `boxjs`).


No arquivo JavaScript dado como segundo argumento deve ser definido um objeto `exports` que ter� como propriedade o que ser� suportado
no restante da URL, cada uma dessas propriedades � na verdade uma fun��o que lida com a requisi��o do usu�rio.

Para o nosso exemplo, criamos o `hello.js` com o seguinte c�digo:

~~~ javascript

exports = {
	modern: function (params,request,response) {
		response.write("<html><body> <h1>Hey route!</h1> </body></html>");
	},
	std: function (params,request,response) {
		response.write("<html><body> <h1>Hello route!</h1> </body></html>");
	}
}

~~~

E o `bye.js` com:

~~~ javascript

exports = {
	std: function (params,request,response) {
		response.write("<html><body> <h1>Bye route!</h1> </body></html>");
	}
}

~~~

![Byeehello](imagens/img-bye-e-hello-js-na-pasta.png)

Agora podemos acessar cada um desses m�todos, respectivamente, com as seguintes URL:


![UrlRotesBrowser](imagens/acessando-url-routes.png)




## Utilizando o `security.js`

Caso algum m�dulo com o nome de `security` seja adicionado ao `config.js`, o boxJS garante que todas as requisi��es, passem, 
primeiramente, por este m�dulo, isso possibilita que seja criado algum tipo de restri��o de acesso, onde uma certa p�gina s� ser� 
fornecida pelo servidor caso as restri��es impostas pelo m�dulo `security` sejam atingidas.

Por padr�o o arquivo security vem conforme [descrito aqui](https://github.com/cneryjr/boxjs/blob/master/boxjs/modules/security.js), ou seja, autorizando todo e qualquer acesso, por�m 
tornar alguma p�gina inacess�vel � uma tarefa simples.

Podemos tornar a p�gina `localhost:8080/helloWorld/boxjs/hello/modern` inacess�vel fazendo as seguintes altera��es ao `security.js` padr�o:

~~~ javascript

safe.hasPermissionInThisMethod = function (paramsObject, request, response, methodName) {

	if(methodName=="modern") {
		http.response.setStatus(403);
		return false;
	}
	
    return true;
};


~~~

Lembramos que o `security.js` que vai junto com o boxJS � apenas um esbo�o de um m�dulo de seguran�a, quem o utiliza tem liberdade para 
(e deve) alterar o seu funcionamento.

OBS: Para pegar um header de uma requisi��o, basta usar o seguinte m�todo `http.requestJava.getHeader("nome-do-header")`.



## MongoDB


### Preparando para usar o MongoDB

Como citado na parte de [como usar o `config.js`](#configurando-o-configjs), para usarmos o mongoDB o primeiro passo � adicion�-lo aos
m�dulos no `config.js` e citar o link com o banco:

~~~ javascript

var config = {
	modules: ["mongodb"],

	mongodb: {
		datasource: "java:comp/env/mongo/MongoDSFactory"
	}
};

~~~


Ap�s modificar o `config.js` para ter estas configura��es, devemos adicionar o datasource ao nosso servidor, isso pode ser feito adicionando
a seguinte tag ao context.xml:

~~~ xml

<Resource name="mongo/MongoDSFactory" auth="Container"
type="com.mongodb.MongoClient" factory="softbox.boxjs.MongoDSFactory"
singleton="false" user="" pass="" uri="mongodb://localhost:27017/nome_do_banco"/>

~~~

![DatasourceNoContext](imagens/datasource-no-context.png)


Agora adicione [o m�dulo do mongo](https://raw.githubusercontent.com/cneryjr/boxjs/master/boxjs/modules/mongodb.js) a sua pasta `modules`.

![DatasourceNoContext](imagens/mongodb-no-modules.png)


Finalmente, adicione o [jar do driver de conex�o ao mongo](https://github.com/cneryjr/boxjs/blob/master/lib/mongo-java-driver-2.12.3.jar?raw=true) � pasta `lib` do `WEB-INF` e tudo deve funcionar normalmente.


### Usando o MongoDB

Para usar o MongoDB recomendamos a cria��o de um m�dulo `init.js`, com apenas o seguinte c�digo:


~~~ javascript

db = db || {};

db.nome_do_banco = function() {
	return db.MongoDB.getDB("nome_do_banco");
}

~~~

Esse m�dulo init deve ser adicionado ao `config.js` e � importante para garantir que n�o ser�o criadas m�ltiplas conex�es com o banco, com este passo pronto, basta que,
quando for necess�rio acessar uma collection, seja utilizado um c�digo semelhante a:

~~~ javascript

var collection = db.nome_do_banco().getCollection("nome_da_collection");

~~~

Com uma collection em m�os uma variedade de opera��es pode ser utilizada:

* insert(doc) - insere um documento a uma collection
* find(query,fields) - executa a 'query' na collection retornando apenas os campos determinados em 'fields'
* count(query) - conta quantos documentos s�o compat�veis com 'query', sem carreg�-los
* distinct(field, query) - retorna os valores que um determinado campo, 'field', assume, caso haja uma 'query', s� retorna os valores distintos para esta 'query'
* remove(query) - remove as emtradas que s�o compat�veis com 'query'
* update(query,update,options) - atualiza as entradas que s�o compat�veis com 'query' para o valor 'update', sendo poss�vel utilizar duas configura��es opcionais:
  * upsert - caso nenhuma entrada seja compat�vel com 'query', inv�s de atualizar, insere uma nova entrada
  * multi - atualiza todas as entradas compat�veis com 'query'
* aggregate - http://docs.mongodb.org/manual/aggregation/

Mais detalhes podem ser vistos no pr�prio c�digo comentado do m�dulo do mongo que voc� adicionou a sua pasta `modules`.