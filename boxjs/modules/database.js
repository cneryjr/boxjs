
db.Database = {

	conn: null,
	
	pstmt: null,
	
	initialize: function() {
		var dbc = config.database;
		log.info("Driver: " + dbc.driver);
		log.info("Driver: " + dbc.url);
    	java.lang.Class.forName("com.mysql.jdbc.Driver");
    	db.Database.conn = java.sql.DriverManager.getConnection(dbc.url, dbc.user || "root", dbc.pass || "");
	    db.Database.conn.prepareStatement("DO 1"); 
	},
	
	setAutoCommit: function(enabled){
		db.Database.conn.setAutoCommit(enabled);
	},
	
	commit: function() {
		db.Database.conn.commit();
	},

	rollback: function(savePoint) {
		if (savePoint != undefined)
			db.Database.conn.rollback(savePoint);
		else
			db.Database.conn.rollback();
	},
	
	setSavepoint: function() {
		return db.Database.conn.setSavepoint();
	},

	execute: function(sql) {
		var stmt = null;
		
	    if (db.Database.conn == null) {
	        db.Database.initialize();
	    }
	    
	    try {
		    stmt =  db.Database.conn.createStatement();
	    	stmt.executeUpdate("DO 1");
	    } catch (e) {
	    	java.lang.System.out.println("== Re-conectando no BD =============================================================");
	    	//db.Database.conn = servlet.connectDB();
	    	this.initialize();
	    	stmt =  db.Database.conn.createStatement();
	    }
	    
	    var rows = new Array();
	    sql = sql.trim();
	
	    if (sql.toUpperCase().indexOf("SELECT") == 0) {
	        var rs = stmt.executeQuery(sql);
	        var rsmd = rs.getMetaData();
	        var numColumns = rsmd.getColumnCount();
	        rows = new Array();
	
	        while (rs.next()) {
	            var row = {};
	
	            for (var i = 1; i < numColumns + 1; i++) {
	                var column_name = rsmd.getColumnLabel(i);
	                var value = rs.getObject(i);
	                row[column_name] = (rs.wasNull()) ? null : new String(value.toString());
	            } //end for
	
	            rows.push(row);
	        }
	
	    } else if (sql.toUpperCase().indexOf("INSERT") == 0) {
	        stmt.executeUpdate(sql, java.sql.Statement.RETURN_GENERATED_KEYS);
	        var rsk = stmt.getGeneratedKeys();
	        if (rsk.next()) {
				var key = rsk.getObject(1);
				java.lang.System.out.println("key is " + key);
	            rows = {"id": parseInt(key.toString())};
	        }            
	        
	    } else {
			java.lang.System.out.println("SQL: " + sql);
	    	var result = stmt.executeUpdate(sql);
	        try {
	            rows = {error: !result};
	        } catch (e) {
	            rows = {error: true, exception: e, message: e.message};
	        }
	    }
	    stmt.close();
	    return rows;
	}
};


//..........................................................................................................................
db.Table = function (tblName) {
    this.tableName = tblName;
};

db.Table.execute = function(sql) {
    java.lang.System.out.println(sql);
    return db.Database.execute(sql);
};

db.Table.prototype.replace = function (tupla) { //}, returnGeneratedKey=true) {
    var sqlInsert = 'REPLACE INTO ' + this.tableName + ' (';
    var values = ' VALUES (';
    var vrg = "";

    for (var key in tupla) {
        if (key.toLowerCase() == 'id')
            continue;
        var val = tupla[key];
        var sep = (typeof(val) == 'string') ? "'" : "";
        sqlInsert += vrg + key;
        values += vrg + sep + val + sep;
        vrg = ",";
    }
    sqlInsert += ') ' +  values + ')';
    //java.lang.System.out.println(sqlInsert);
    result = db.Table.execute(sqlInsert);

    return result;
};

db.Table.prototype.insert = function (tupla) { //}, returnGeneratedKey=true) {
    var sqlInsert = 'INSERT INTO ' + this.tableName + ' (';
    var values = ' VALUES (';
    var vrg = "";

    for (var key in tupla) {
        if (key.toLowerCase() == 'id')
            continue;
        var val = tupla[key];
        var sep = (typeof(val) == 'string') ? "'" : "";
        sqlInsert += vrg + key;
        values += vrg + sep + val + sep;
        vrg = ",";
    }
    sqlInsert += ') ' +  values + ')';
    result = db.Table.execute(sqlInsert);

    return result;
};

db.Table.prototype.update = function(row) {
    var sql = 'UPDATE ' + this.tableName + ' SET ';
    var vrg = '';
    for (var key in row) {
    	var val = row[key];
        var sep = (typeof(val) == 'string') ? "'" : '';
        sql += vrg + key + ' = ' + sep + val + sep;
        vrg = ',';
    }
     sql += ' WHERE id = ' + row["id"];
    return db.Table.execute(sql);
};

db.Table.prototype.deleteByExample = function(row) {
    var sql = 'DELETE FROM ' + this.tableName + ' WHERE 1=1 ';
    var _and_ = ' AND ';
    for (var key in row) {
    	var val = row[key];
        var sep = (typeof(val) == 'string') ? "'" : '';
        sql += _and_ + key + '=' + sep + val + sep;
    }
    return db.Table.execute(sql);
};

db.Table.prototype["delete"] = function(row) {
    /*if (is_array($tuple)) {
        $result = false;
        foreach ($tuple as $row)
            $result = $this->deleteByExample(array(id => $row['id']));
    } else
        $result = $this->deleteByExample(array(id => $tuple->id)); */
	var rows = [].concat(row), result = null;
	for (var i=0; i < rows.length; i++) {
        result = this.deleteByExample({id: row['id']});
	}
    return result;
};

db.Table.prototype.selectById = function(row) {
    var sql = 'SELECT * FROM ' + this.tableName + ' WHERE 1=1 AND id = ' + row["id"];
    return db.Table.execute(sql);
};

db.Table.prototype.selectByExample = function(row) {
    var sql = 'SELECT * FROM ' + this.tableName + ' WHERE 1=1 ';
    var _and_ = ' AND ';

    for (var key in row) {
    	var val = row[key];
    	if (key == 'id')
    		continue;
        if (val.length > 0) {
            var sep = (typeof(val) == 'string') ? "'" : '';
            sql +=  _and_  + key + ((val.indexOf('%') >= 0) ? ' like ' : '=') + sep + val + sep;
        }
    }
    return db.Table.execute(sql);
};

db.Table.prototype.search = db.Table.prototype.selectByExample;
	
db.Table.prototype.all =  function() {
    var sql = 'SELECT * FROM ' + this.tableName;
    return db.Table.execute(sql);
};


//..........................................................................................................................
print("database.js loaded..............................................");
