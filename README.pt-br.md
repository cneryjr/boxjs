boxJS
=====

boxJS é um container de execução/interpretação JavaScript por parte do servidor Web, ou seja, é um Server-side JavaScript ou (SSJS).
Ele permite a escrita em JavaScript de códigos a serem interpretados pelo servidor Web, da mesma forma como ocorre com o PHP, por exemplo.

## Tutorial

#### 1ª Passo
Criar um Dynamic Web Project no eclipse. Siga [este](http://besthowtodo.com/blog/2010/05/how-to-create-dynamic-web-project-in-eclipse.html) tutorial.

#### 2ª Passo
Copiar o diretório 'boxjs' para dentro do diretório /WEB-INF e copie os arquivos boxjs.jar and js.jar para o diretório /WEB-INF/lib, conforme mostrado na figura abaixo.
![Softbox F01](https://raw.github.com/cneryjr/boxjs/master/docs/images/tutorial_fig01.png)


#### 3ª Step
Configure o arquivo web.xml com a seguinte configuração:

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

#### 4ª Step
Selecione o projeto 'tutorial' na aba 'Project Explorer' e pressione as teclas "Alt+Enter".
Selecione a opção "Java Build Path" no painel à esquerda e em seguida selecione a aba "Order and Export".
Selecione o combobox referente a "Web App Libraries" e clique no botão "OK".

![Softbox F02](https://raw.github.com/cneryjr/boxjs/master/docs/images/tutorial_fig02.png)


#### 5ª Passo
Inicie o projeto no eclipse e abra a seguinte URL no browser http://localhost:8080/tutorial/boxjs/hello.js?param1=test

Divirta-se!

## License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
