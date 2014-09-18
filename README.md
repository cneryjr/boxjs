boxJS v.0.4.0
============

boxJS is a container for the application / interpretation JavaScript from the Web server, or is a Server-side JavaScript or (SSJS). It allows code written in JavaScript to be interpreted by the Web server, the same way as with PHP, for example.
boxJS it's run in Nashorn (Java 8 Javascript engine) and allow to debug Javascript source code in server side.

## What's new?

* v.0.4.0 - The interpretation Javascript engine was swapped from Rhino to Nashorn (Java 8)
* v.0.3.0 - Routing module released.
* v.0.2.9 - Security module released.
* v.0.2.8 - Database module improvemented.
* v.0.2.7 - Dynamic loading of modules.


## Tutorial


#### 1st Step
It's create a simple web application in NetBeans using Tomcat servlet container 7.x or 8.x. Follow [this](https://netbeans.org/kb/docs/web/quickstart-webapps.html) tutorial.


#### 2nd Step 
Copy directory 'boxjs' into the folder "/Web Pages" and copy the files boxjs.jar, servlet-api.3.0.jar and tomcat-jdbc.jar to /WEB-INF/lib, as shown in the figure below.

![Softbox F01](https://raw.github.com/cneryjr/boxjs/master/docs/images/helloWorld01.png)


#### 3rd Step

Create a file named 'hello.js' within the boxjs ("/HelloWorld/web/boxjs") directory, copy and paste the code below:

``` javascript

print("Hello World!");

console.log("Running hello.js...");

http.response.write("<html> <head><title>hello.js</title></head> " 
    + "<body> <h1> Hello at " + new Date() + " from " + http.request.requestURI
    + " </h1> <hr>" + "" + "<br>" + "<hr> </body> </html>");
    
print("-- hello.js [finished] --------------------------------------------");
    
```

### <div style="color: #FF0000">Is outdated and will be fixed in the coming days.<br/></div>

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

