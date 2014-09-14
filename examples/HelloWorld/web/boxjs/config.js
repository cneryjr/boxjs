var config = {
	developerMode: true,
        
	modules: ["database", "io", "binary", "jsrender"],
	
        mongodb: {
            /* mongoClientUri: "mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database[.collection]][?options]]" */
            host: "127.0.0.1",
            port: 27017
        },
        
	database: {
	    /* datasource: "jdbc/TestDB" */
            datasource: "java:/comp/env/jdbc/TestDB"
	}
};
