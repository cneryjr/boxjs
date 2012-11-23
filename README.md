boxJS v0.2.4
============

boxJS is a container for the application / interpretation JavaScript from the Web server, or is a Server-side JavaScript or (SSJS).
It allows code written in JavaScript to be interpreted by the Web server, the same way as with PHP, for example.

## Tutorial

#### 1st Step
It's create a Dynamic Web Project in eclipse. Follow [this](http://besthowtodo.com/blog/2010/05/how-to-create-dynamic-web-project-in-eclipse.html) tutorial.

#### 2nd Step 
Copy directory 'boxjs' into the directory /WEB-INF and copy the files boxjs.jar and js.jar  to /WEB-INF/lib, as shown in the figure below.

![Softbox F01](https://raw.github.com/cneryjr/boxjs/master/docs/images/tutorial_fig01.png)


#### 3rd Step
Configure web.xml file with following configuration:

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

#### 4th Step
Select the project 'tutorial' tab 'Project Explorer' and press the "Alt + Enter".
Select the "Java Build Path" in the left pane and then select the tab "Order and Export".
Select the combobox related to "Web App Libraries" and click "OK".

![Softbox F02](https://raw.github.com/cneryjr/boxjs/master/docs/images/tutorial_fig02.png)


#### 5th Step
Start the project in eclipse and open the following URL in the browser http://localhost:8080/tutorial/boxjs/hello.js?param1=test

Have fun!

## Documentation

<div class="summary docProperty">
<h3 class="">Public Variables</h3>

<table class="">
<colgroup>
	<col class="col-property">
	<col class="col-type">
	<col class="col-description">
</colgroup>
<tbody><tr>
  <th>Property</th><th>Type</th><th>Description</th>
</tr>
<tr style="background-color: #F8F8F8; border-top: 1px solid #DDDDDD;" id="actionPrefix">
  <td style="color: #4183C4;">global</td>
  <td>Object</td>
  <td>Cont&eacute;m vari&aacute;veis ambientais como scope, request etc.</td>
</tr>
</tbody></table>
</div>

<h3 style="color: #4183C4; border-bottom: 2px dotted #4183C4; margin-right: 200px">namespace http</h3>

<div class="summary docNamespaces">
<h4>Public Functions</h4>

<table class="summaryTable">
<colgroup>
	<col class="col-property">
	<col class="col-type">
	<col class="col-description">
</colgroup>
<tbody><tr>
  <th>Function</th><th>Return</th><th>Description</th>
</tr>
<tr style="background-color: #f8f8f8; border-top: 1px solid #DDDDDD;" id="actionPrefix">
  <td style="color: #4183C4;">parseParams</td>
  <td>Object</td>
  <td>Executa o parse dos par&acirc;metros enviados em uma requisi&ccedil;&atilde;o de GET ou POST, retornando-os em um objeto JSON com chave e valor.<br>
      <span style="color:#4183C4 ">Parameters: <br></span>
      <span style="margin-left: 30px">queryString {String} - cont&eacute;m os par&acirc;metros da chamada URL.</span><br>
      <span style="color:#4183C4 ">Example: <br></span>
      <span style="margin-left: 30px">var qrys = http.parseParams(global.queryString || "");</span>
   </td>
</tr>
<trstyle="background-color: #FFFFFF; border-top: 1px solid #CCCCCC;" id="actionPrefix">
  <td style="color: #4183C4;">uploadFile</td>
  <td>none</td>
  <td>Executa o upload de um arquivo a partir do client web e salva no servidor.<br>
      <span style="color:#4183C4 ">Parameters: <br></span>
      <span style="margin-left: 30px">path {String} - caminho onde o arquivo deve ser salvo.</span><br>
     <span style="color:#4183C4 ">Example: <br></span>
     <span style="margin-left: 30px">http.uploadFile("/temp/");</span>
  </td>
</tr>
</tbody></table>
</div>

<h3 style="color: #4183C4; border-bottom: 2px dotted #4183C4; margin-right: 200px">namespace db</h3>

<div class="summary docNamespaces">
<h4>Public Variables</h4>

<table style="border: 1px solid #DDDDDD">
<colgroup>
	<col class="col-property">
	<col class="col-type">
	<col class="col-description">
</colgroup>
<tbody><tr>
  <th>Function</th><th>Type</th><th>Description</th>
</tr>
<tr style="background-color: #f8f8f8; border-top: 1px solid #DDDDDD;" id="actionPrefix">
  <td style="color: #4183C4;">Database</td>
  <td>Object</td>
  <td>Objeto com métodos de controle de transação e execução de comandos DML (insert, update, delete and select).
   </td>
</tr>
<trstyle="background-color: #FFFFFF; border-top: 1px solid #CCCCCC;" id="actionPrefix">
  <td style="color: #4183C4;">Table</td>
  <td>Object</td>
  <td>Classe que representa uma tabela do banco de dados.<br>
      <span style="color:#4183C4 ">Parameters: <br></span>
      <span style="margin-left: 30px">name{String} - nome da tabela a ser manipulada.</span><br>
     <span style="color:#4183C4 "><br></span>
     <span style="margin-left: 30px"></span>
  </td>
</tr>
</tbody></table>
</div>


## License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

