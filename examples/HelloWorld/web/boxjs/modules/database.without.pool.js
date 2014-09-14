var dbx = db;

/** @namespace Agrupa funcionalidades relativas ao servidor de banco de dados. */
dbx.Database = {

	conn: null,

	pstmt: null,
	
	initialize: function() {
		var dbc = config.database;
		log.info("Driver: " + dbc.driver);
		log.info("Driver: " + dbc.url);
    	java.lang.Class.forName("com.mysql.jdbc.Driver");
    	dbx.Database.conn = java.sql.DriverManager.getConnection(dbc.url, dbc.user || "root", dbc.pass || "");
	    dbx.Database.conn.prepareStatement("DO 1"); 
	},
	
	/**
	 * Define o modo de opera&ccedil;&atilde;o da conex&atilde;o com rela&ccedil;&atilde;o 
	 * ao commit dos comandos SQL, auto-commit <i>true</i> ou <i>false</i>.
	 * @param {boolean} enabled Flag que define o commit autom&aacute;tico ou n&atilde;o 
	 * dos comandos SQL ap�s execu&ccedil;&atilde;o.
	 */	
	setAutoCommit: function(enabled){
		dbx.Database.conn.setAutoCommit(enabled);
	},
	
	commit: function() {
		dbx.Database.conn.commit();
	},

	rollback: function(savePoint) {
		if (savePoint != undefined)
			dbx.Database.conn.rollback(savePoint);
		else
			dbx.Database.conn.rollback();
	},
	
	setSavepoint: function() {
		return dbx.Database.conn.setSavepoint();
	},

	/**
	 * Executa um <i>statement</i> SQL (DML).
	 * @param {string} sql O comando SQL a ser executado.
	 * @returns {Object} No caso do comando ser um SELECT retorna um array de objetos
	 * ou caso contr&aacute;rio um objeto com a propriedade <i>error<i> valorada com um booleano 
	 * <i>true<i> ou <i>false<i> de acordo com o resultado da execu&ccedil;&atilde;o do comando SQL.
	 */	
	execute: function(sql) {
		var stmt = null;
		
	    if (dbx.Database.conn == null) {
	        dbx.Database.initialize();
	    }
	    
	    try {
		    stmt =  dbx.Database.conn.createStatement();
	    	stmt.executeUpdate("DO 1");
	    } catch (e) {
	    	java.lang.System.out.println("== Re-conectando no BD =============================================================");
	    	//dbx.Database.conn = servlet.connectDB();
	    	this.initialize();
	    	stmt =  dbx.Database.conn.createStatement();
	    }
	    
	    var rows = new Array();
	    sql = sql.trim();
	
	    if (sql.toUpperCase().indexOf("SELECT") == 0) {
	        var rs = stmt.executeQuery(sql);
	        var rsmd = rs.getMetaData();
	        var numColumns = rsmd.getColumnCount();
	        var columns = [];
	        rows = new Array();

            for (var cl = 1; cl < numColumns + 1; cl++)
            	columns[cl] = rsmd.getColumnLabel(cl);
	        
	        while (rs.next()) {
	            var row = {};
	
	            for (var i = 1; i < numColumns + 1; i++) {
	                //var column_name = rsmd.getColumnLabel(i);
	                //var value = rs.getObject(i);
	                //row[column_name] = (rs.wasNull()) ? null : new String(value.toString());

	                var value = rs.getObject(i);
	                row[columns[i]] = (rs.wasNull()) ? null : new String(value.toString());
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
	        try {
		    	var result = stmt.executeUpdate(sql);
	            rows = {error: false, affectedRows: result};
	        } catch (e) {
	            rows = {error: true, exception: e, message: e.message};
	        }
	    }
	    stmt.close();
	    return rows;
	}
};


//..........................................................................................................................
/**
* Table &eacute; uma classe que representa uma tabela (entidade) de um banco de dados, 
* encapsulando m&eacute;todos de manipula&ccedil;&aacute;o da tabela, tais como, INSET, UPDATE, DELETE e 
* SELECT. 
* @param {string} tblName O nome da tabela a ser manipulada.
* @constructor
*/
dbx.Table = function (tblName) {
    this.tableName = tblName;
};

dbx.Table.execute = function(sql) {
    java.lang.System.out.println(sql);
    return dbx.Database.execute(sql);
};

dbx.Table.prototype.replace = function (tupla) { //}, returnGeneratedKey=true) {
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
    result = dbx.Table.execute(sqlInsert);

    return result;
};

dbx.Table.prototype.insert = function (tupla) { //}, returnGeneratedKey=true) {
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
    result = dbx.Table.execute(sqlInsert);

    return result;
};

dbx.Table.prototype.update = function(row) {
    var sql = 'UPDATE ' + this.tableName + ' SET ';
    var vrg = '';
    for (var key in row) {
    	var val = row[key];
        var sep = (typeof(val) == 'string') ? "'" : '';
        sql += vrg + key + ' = ' + sep + val + sep;
        vrg = ',';
    }
     sql += ' WHERE id = ' + row["id"];
    return dbx.Table.execute(sql);
};

dbx.Table.prototype.deleteByExample = function(row) {
    var sql = 'DELETE FROM ' + this.tableName + ' WHERE 1=1 ';
    var _and_ = ' AND ';
    for (var key in row) {
    	var val = row[key];
        var sep = (typeof(val) == 'string') ? "'" : '';
        sql += _and_ + key + '=' + sep + val + sep;
    }
    return dbx.Table.execute(sql);
};

dbx.Table.prototype["delete"] = function(row) {
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

dbx.Table.prototype.selectById = function(row) {
    var sql = 'SELECT * FROM ' + this.tableName + ' WHERE 1=1 AND id = ' + row["id"];
    return dbx.Table.execute(sql);
};

dbx.Table.prototype.selectByExample = function(row) {
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
    return dbx.Table.execute(sql);
};

dbx.Table.prototype.search = dbx.Table.prototype.selectByExample;
	
dbx.Table.prototype.all =  function() {
    var sql = 'SELECT * FROM ' + this.tableName;
    return dbx.Table.execute(sql);
};


//..........................................................................................................................
print("database.js loaded..............................................");
