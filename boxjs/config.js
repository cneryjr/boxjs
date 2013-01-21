var config = {
	applicationRoot: "/",
	entryPoint: "/application.js",
	database: {
		pooling: true,
		maxActive: 50,
		initialSize: 10, 
		defaultAutoCommit: true,
		url: "jdbc:mysql://localhost:3306/sco",
		driver: "com.mysql.jdbc.Driver",
		user: "root"
	}
};