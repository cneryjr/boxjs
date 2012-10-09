
db.Database = {

	conn: null,
	
	pstmt: null,
	
	initialize: function() {
		var dbc = config.database;
    	//java.lang.Class.forName(dbc.driver);
		log.info("Driver: " + dbc.driver);
		log.info("Driver: " + dbc.url);
    	java.lang.Class.forName("com.mysql.jdbc.Driver");
    	db.Database.conn = java.sql.DriverManager.getConnection(dbc.url, dbc.user || "root", dbc.pass || "");
	    db.Database.conn.prepareStatement("DO 1"); 
	},

	execute: function(sql) {
	    if (db.Database.conn == null) {
	        db.Database.initialize();
	    }
	    
	    var stmt =  db.Database.conn.createStatement();
	    
	    try {
	    	stmt.executeUpdate("DO 1");
	    } catch (e) {
	    	java.lang.System.out.println("== Re-conectando no BD =============================================================");
	    	db.Database.conn = servlet.connectDB();
	    	stmt =  db.Database.conn.createStatement();
	    }
	    
	    var rows = new Array();
	    sql = sql.trim();
	
	    if (sql.toUpperCase().indexOf("SELECT") == 0) {
	        //var rs = db.Database.stmt.executeQuery(sql);
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
	        //var result = db.Database.stmt.executeUpdate(sql, java.sql.Statement.RETURN_GENERATED_KEYS);
	        //var rsk = db.Database.stmt.getGeneratedKeys();
	        stmt.executeUpdate(sql, java.sql.Statement.RETURN_GENERATED_KEYS);
	        var rsk = stmt.getGeneratedKeys();
	        if (rsk.next()) {
				var key = rsk.getObject(1);
				java.lang.System.out.println("key is " + key);
	            rows = {"id": parseInt(key.toString())};
	        }            
	        
	    } else {
			java.lang.System.out.println("SQL: " + sql);
	    	//var result = db.Database.stmt.executeUpdate(sql);
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

//$result = db.Database::execute("SELECT * from tusuario");
//echo '$rows: ' . json_encode($result);

//db.Database.initialize();


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
    //java.lang.System.out.println(sqlInsert);
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
     //java.lang.System.out.println(sql);
    return db.Table.execute(sql);
};

db.Table.prototype.deleteByExample = function(row) {
    //DELETE FROM tableName [WHERE expr]
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

    //CloudSQL.write_log('db.Table.selectByExample - $typle: ' . json_encode($tuple) . '\n');
    for (var key in row) {
    	var val = row[key];
    	if (key == 'id')
    		continue;
        if (val.length > 0) {
        	//java.lang.System.out.println("typeof(" + val + ") => " + typeof(val));
            var sep = (typeof(val) == 'string') ? "'" : '';
            sql +=  _and_  + key + ((val.indexOf('%') >= 0) ? ' like ' : '=') + sep + val + sep;
        }
    }
    return db.Table.execute(sql);
};

db.Table.prototype.search = db.Table.prototype.selectByExample;
	
db.Table.prototype.all =  function() {
    var sql = 'SELECT * FROM ' + this.tableName;
    //java.lang.System.out.println(sql);
    return db.Table.execute(sql);
};


//..........................................................................................................................
//var r = db.Database.execute("SELECT * from ttipconta");
//var r = db.Database.execute("SELECT * from tmembro");
//var r = db.Database.execute('INSERT into trede (nome, cordenador) values ("Rede VI", 5)');
//var r  = db.Database.execute('UPDATE trede SET nome = "Rede X" WHERE id = 7');
//var r  = db.Database.execute('DELETE from trede WHERE id > 3');
//var r = db.Database.execute("select l.id, DATE_FORMAT(IF(l.datprv IS NULL,l.datctb, l.datprv), '%d/%m/%Y') as datprv, c.nomcat, c.id as catlca, x.id as ctalca, REPLACE(REPLACE(REPLACE(FORMAT(l.vlrprv, 2), '.', '|'), ',', '.'), '|', ',') as vlrprv, IF(vlrprv > 0, REPLACE(REPLACE(REPLACE(FORMAT( IF(vlrlca is NULL, vlrprv, vlrlca),2), '.', '|'), ',', '.'), '|', ','), '0,00') as Credito, IF(vlrprv < 0, REPLACE(REPLACE(REPLACE(FORMAT( IF(vlrlca is NULL, vlrprv, vlrlca),2), '.', '|'), ',', '.'), '|', ','), '0,00') as Debito, DATE_FORMAT(l.datctb, '%d/%m/%Y') as datctb, IF(l.stsctb = 0, 'Contabilizado', IF(l.stsctb = 1, 'Confirmado', IF(l.stsctb = 2, 'Previsto', 'Pendente'))) as Status , l.prplca, l.obslca , \"<img src='fin/img/ctblca.png' width='14' height='14' title='confirmar' />\" as Conf , \"<img src='/fin/img/edit.png' width='14' height='14' title='edit' />\" as Edit from tlancamento l, tcategoria c, tconta x where l.catlca = c.id and l.ctalca = x.id");
//out.println("<h3>Result:</h3><br>" + JSON.stringify(r) + "<br>");

//out.println("<h1>FIM</h1><br>");

/*
var params = parseParams(queryString);

var rs, tRede = new db.Table(params.entity);
//rs = tRede.all();
rs = tRede[params.action](params.row);
out.println(JSON.stringify(rs));
*/

print("database.js loaded..............................................");
