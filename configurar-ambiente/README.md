# Configurando o ambiente de desenvolvimento


Para come�armos a trabalhar com o boxJS precisamos, antes de mais nada, fazer algumas configura��es no nosso ambiente de 
desenvolvimento. Esse tutorial � feito utilizando o Eclipse e o Tomcat, mas qualquer IDE e qualquer servidor de aplica��o
pode ser usado, a configura��o ser� semelhante, mas n�o exatamente a mesma.

Come�amos criando um Dynamic Web Project:

![Criando projeto](firstProject/criando_projeto1.png)

![Criando projeto](firstProject/criando_projeto2.png)

Neste passo � importante checar se o Tomcat esta selecionado e clicar para ir para o pr�ximo, ao inv�s de finalizar, conforme 
imagem abaixo:

![Configuracao novo projeto](firstProject/criando_projeto3.png)

Nesta tela n�o h� necessidade de modificar nada, apenas siga para a pr�xima.

![Configuracao novo projeto](firstProject/criando_projeto4.png)

Nesta parte � importante marcar a op��o de gerar o web.xml automaticamente, conforme imagem abaixo:

![Configuracao novo projeto](firstProject/criando_projeto5.png)

Pronto, temos nosso primeiro projeto criado, por�m o boxJS ainda n�o funcionar�, precisamos fazer apenas mais uma configura��o.

Adicionaremos � pasta `lib`, que est� dentro da pasta `WEB-INF`, que, por sua vez, est� dentro da pasta `WebContent`, o [jar do boxJS](https://github.com/cneryjr/boxjs/blob/master/lib/boxjs.jar?raw=true),
do [Tomcat](https://github.com/cneryjr/boxjs/blob/master/lib/tomcat-jdbc.jar?raw=true) e da [api de servlet](https://github.com/cneryjr/boxjs/blob/master/lib/servlet-api-3.0.jar?raw=true), conforme imagem abaixo:

![Jars na pasta lib](firstProject/criando_projeto6.png)



Feito isso, basta que adicionemos nosso novo projeto ao Tomcat, conforme as imagens abaixo:

![Adicionando projeto ao servidor](firstProject/criando_projeto7.png)

![Adicionando projeto ao servidor](firstProject/criando_projeto8.png)

� importante lembrar que todos os arquivos `.js` devem estar dentro da pasta boxjs ou algum subdiret�rio, conforme a 
imagem abaixo.


![Hello World](firstProject/hello_dentro_boxjs.png)


Pronto, nosso ambiente j� est� completamente pronto para funcionar o boxJS!