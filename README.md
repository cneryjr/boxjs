boxJS v0.1.0
============

boxJS is a container for the application / interpretation JavaScript from the Web server, or is a Server-side JavaScript or (SSJS).
It allows code written in JavaScript to be interpreted by the Web server, the same way as with PHP, for example.

## Tutorial

#### 1st Step
It's create a Dynamic Web Project in eclipse. Follow [this](http://besthowtodo.com/blog/2010/05/how-to-create-dynamic-web-project-in-eclipse.html) tutorial.

#### 2nd Step 
Configure the web.xml with following configuration:

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
