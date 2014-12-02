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
    },
    
    json: function() {
        http.response.write('{"nome": "David", "idade": 7}');
    },
    
    red: function() {
        
    var uri = "https://www.hostedredmine.com";
    var apiAccessKey = "7e9f0a2eda8b0fd2aa509491f782021c96cba288";
    var projectKey = "erp-softbox";
    var queryId = null; // any


        var mgr = com.taskadapter.redmineapi.RedmineManagerFactory.createWithApiKey(uri, apiAccessKey);
        var issueManager = mgr.getIssueManager();
        var issues = issueManager.getIssues(projectKey, queryId);
        for (var issue in issues) {
            System.out.println(issue.toString());
        }        
        
    }
};

print("Finished ----------------------------------------------------------------");
