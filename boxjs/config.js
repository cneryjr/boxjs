var config = {
	developerMode: true,
	modules: ["database", "io", "binary"],
	
	database: {
	    /* datasource: "jdbc/TestDB" */
    	datasource: "java:/comp/env/jdbc/TestDB"
	},
	debugMode: false
};
