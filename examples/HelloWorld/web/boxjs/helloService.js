print("Initing...");

//http.response.write("<html> <head><title>hello.js</title></head> <body> <h1> Hello at "
//    + new Date() + " from " + http.request.requestURI
//    + " </h1> <hr>" + "" + "<br>" + "<hr> </body> </html>");


exports = {
    
    hello: function() {
        http.response.write("<html><body> <h1>Hello boxJS!</h1> </body></html>");
    },
    
    bye: function() {
        http.response.write("<html><body> <h1>Bye boxJS!</h1> </body></html>");
    }
};

print("Finished ----------------------------------------------------------------");
