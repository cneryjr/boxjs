boxJS v0.2.1
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


## License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

