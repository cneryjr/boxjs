var config = {
	modules: ["database", "mongodb", "io", "binary", "jsrender"],
	
	mongodb: {
		datasource: "java:comp/env/mongo/MongoDSFactory"
	},
	
	database: {
		/* datasource: "jdbc/TestDB" */
		datasource: "java:/comp/env/jdbc/TestDBx"
	}
};
