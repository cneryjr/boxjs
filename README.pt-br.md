boxJS
=====

boxJS � um container de execu��o/interpreta��o JavaScript por parte do servidor Web, ou seja, � um Server-side JavaScript ou (SSJS).
Ele permite a escrita em JavaScript de c�digos a serem interpretados pelo servidor Web, da mesma forma como ocorre com o PHP, por exemplo.

## Tutorial

#### 1� Passo
Criar um Dynamic Web Project no eclipse. Siga [este](http://besthowtodo.com/blog/2010/05/how-to-create-dynamic-web-project-in-eclipse.html) tutorial.

#### 2� Passo
Copiar o diret�rio 'boxjs' para dentro do diret�rio /WEB-INF e copie os arquivos boxjs.jar and js.jar para o diret�rio /WEB-INF/lib, conforme mostrado na figura abaixo.
![Softbox F01](https://raw.github.com/cneryjr/boxjs/master/docs/images/tutorial_fig01.png)


#### 3� Step
Configure o arquivo web.xml com a seguinte configura��o:

``` xml
<?xml version="1.0" encoding="utf-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
      version="3.0">

  <!-- Processador Javascript -->
    <servlet>
        <servlet-name>BoxJSServlet</servlet-name>
        <servlet-class>sbx.boxjs.BoxJSServlet</servlet-class>
        
	  <init-param>
	    <param-name>configFile</param-name> 
	    <param-value>config.js</param-value> 
	  </init-param>

		<load-on-startup>1</load-on-startup>
    </servlet>
 
    <servlet-mapping>
        <servlet-name>BoxJSServlet</servlet-name>
        <url-pattern>/boxjs/*</url-pattern>
    </servlet-mapping>
	<!-- ...................... -->

	<welcome-file-list>
		<welcome-file>index.html</welcome-file>
	</welcome-file-list>
</web-app>
```

#### 4� Step
Selecione o projeto 'tutorial' na aba 'Project Explorer' e pressione as teclas "Alt+Enter".
Selecione a op��o "Java Build Path" no painel � esquerda e em seguida selecione a aba "Order and Export".
Selecione o combobox referente a "Web App Libraries" e clique no bot�o "OK".

![Softbox F02](https://raw.github.com/cneryjr/boxjs/master/docs/images/tutorial_fig02.png)


#### 5� Passo
Inicie o projeto no eclipse e abra a seguinte URL no browser http://localhost:8080/tutorial/boxjs/hello.js?param1=test

Divirta-se!