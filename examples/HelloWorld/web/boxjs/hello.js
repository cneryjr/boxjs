print("Hello World!");

console.log("Running hello.js...");

http.response.write("<html> <head><title>hello.js</title></head> <body> <h1> Hello at "
    + new Date() + " from " + http.request.requestURI
    + " </h1> <hr>" + "" + "<br>" + "<hr> </body> </html>");

print("-- hello.js [finished] --------------------------------------------");
