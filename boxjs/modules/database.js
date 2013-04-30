/** @namespace Agrupa funcionalidades relativas ao servidor de banco de dados. */
db.Database = {

	pstmt: null,
	
	getConnection: function() {
		return ds.getConnection();
	},
	
	/**
	 * Retorna um objeto Transction para que com ele possa ser realizado
	 * o controle de transação.
	 * @returns {Transaction}
	 */
	getTransaction : function() {
		var DBTransaction = function() {
			this.connection = db.Database.getConnection();
			this.connection.setAutoCommit(false);
		};
		DBTransaction.prototype = Transaction;
	    return new DBTransaction();
	},
	
	/**
	 * Executa um <i>statement</i> SQL (DML).
	 * @param  {String} 	sql 		  O comando SQL a ser executado.
	 * @param  {Transaction} [connection]  Conex&atilde;o com o banco de dados
	 * @returns {Object} No caso do comando ser um SELECT retorna um array de objetos
	 * ou caso contr&aacute;rio um objeto com a propriedade <i>error<i> valorada com um booleano 
	 * <i>true<i> ou <i>false<i> de acordo com o resultado da execu&ccedil;&atilde;o do comando SQL.
	 */	
	execute: function(sql, transaction) {
		var stmt = this.createPrepareStatement(sql,transaction);
		var result = stmt.execute();
		stmt.close();
		return result;
	},	
	/**
	 * Cria um novo <i> Prepare Statement </i>
	 * @param   {String}       sql            O comando SQL a ser executado.
	 * @param   {Transaction} [transaction]   Transação em que
	 * 
	 *  
	 *  
	 *  
	 *  será executado os comandos.
	 * @returns {Object}  Objetos com métodos execute e executeRows.  
	 */
	createPrepareStatement: function(sql, transaction) {
		var mustClose = transaction == undefined ? true : false;
		var conn = (transaction != null ? transaction.getConnection() : this.getConnection());
		return {
			stmt: conn.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS),
			/**
			 * Executa um Prepare Statement
			 * @param    {Array} [args] Array de objetos que contem os parametros para executar o statement.
			 * @returns {Object} No caso do comando ser um SELECT retorna um array de objetos
			 * ou caso contr&aacute;rio um objeto com a propriedade <i>error<i> valorada com um booleano 
			 * <i>true<i> ou <i>false<i> de acordo com o resultado da execu&ccedil;&atilde;o do comando SQL.
			 */
			execute: function(args) {
				args = args || [];
				for(var i=0; i < args.length; i++) {					
					if(args[i] == null) {
						this.stmt.setObject(i+1,args[i]);
					} else if (args[i].constructor.name == "Date") {
						this.stmt.setTimestamp(i+1, new java.sql.Timestamp(args[i].getTime()));
					} else {
					    this.stmt.setObject(i+1,args[i]);
					};
				}
				var rows = new Array();
				sql = sql.trim();
			    if (sql.toUpperCase().indexOf("SELECT") == 0) {
			    	var rs = this.stmt.executeQuery();
			        var rsmd = rs.getMetaData();
			        var numColumns = rsmd.getColumnCount();
			        var columns = new Array();
			        rows = new Array();

		            for (var cl = 1; cl < numColumns + 1; cl++)
		            	columns[cl] = rsmd.getColumnLabel(cl);
			        
			        while (rs.next()) {
			            var row = {};
			
			            for (var i = 1; i < numColumns + 1; i++) {
			                var value = rs.getObject(i);
			                row[columns[i]] = (rs.wasNull()) ? null : new String(value.toString());
			            } //end for
			
			            rows.push(row);
			        }
			        return rows;
			        
			    } else if (sql.toUpperCase().indexOf("INSERT") == 0) {
			       this.stmt.executeUpdate();
			        var rsk = this.stmt.getGeneratedKeys();
			        if (rsk.next()) {
						var key = rsk.getObject(1);
						java.lang.System.out.println("key is " + key);
			            rows = {"id": parseInt(key.toString())};
			        } 
			        return rows;
			        
			    } else {
			    	var result = this.stmt.executeUpdate();
		            return {error: false, affectedRows: result};
			    }
			},
			/**
			 * Executa um prepare Statement passando como paramêtro varias linhas.
			 * @param    {Array} [args] Array de Arrays que contem objetos os parametros para executar o statement.
			 * @returns {Object} No caso do comando ser um SELECT retorna um array que contem arrays de o objetos
			 * obtidos na execucao da consulta no banco, ou caso contr&aacute;rio um array de objeto 
			 * com a propriedade <i>error<i> valorada com um booleano 
			 * <i>true<i> ou <i>false<i> de acordo com o resultado da execu&ccedil;&atilde;o do comando SQL.
			 */
			executeRows: function(args) {
				args = args || [];				
				if(sql.trim().toUpperCase().indexOf("SELECT") == 0) {
					var rows = new Array();
					args.forEach(function(row, idx) {
						rows.push(this.execute(row));
					});
					return rows;
				} else {
					for(var i=0; i < args.length; i++) {					
						for(var j=0; j < args[i].length; j++) {
							if(args[i][j] == null) {
								this.stmt.setObject(j+1,args[i][j]);
							} else if (args[i][j].constructor.name == "Date") {
								this.stmt.setTimestamp(j+1, new java.sql.Timestamp(args[i][j].getTime()));
							} else {
							    this.stmt.setObject(j+1,args[i][j]);
							};
						}
						this.stmt.addBatch();
						if ((i + 1) % 100 == 0) {
							this.stmt.executeBatch();
						};
					}
					var rsk = this.stmt.executeBatch();
					var rows = new Array();
					for(var key in rsk) {
						if(rsk[key] >= 0) {
							rows.push({error: false, affectedRows: rsk[key]});
						} else if(rsk[key] == java.sql.Statement.SUCCESS_NO_INFO) {
							rows.push({error: false, affectedRows: "unknown"});
						} else if(rsk[key] == java.sql.Statement.EXECUTE_FAILED ){
							rows.push({error: true, affectedRows: 0});
						};
			        }; 
			        return rows;
				};
			},
			/**
			 * Encerra a transação e devolve a conexão utilizada para o datasource.
			 */
			close: function() {
				this.stmt.close();
				if (mustClose)
					conn.close();
			}
		};
	}
};

//..........................................................................................................................

/**
 * Objeto que contem os métodos necessários para realizar o controle de transação no banco de dados.
 * @example <caption>Para instanciar um objeto Transaction utilize o seguinte comando: </caption>
 * db.Database.getTransaction(); 
 */
var Transaction = {
	connection : false,
	/**
	 * Retorna a conexão do banco de dados utilizado pela transação
	 * @returns {Connection} connection
	 */
	getConnection : function() {
		return this.connection;
	},
	/**
	 * Inicia uma nova transação
	 * @property   {Object} params Valores padrão.
	 * @attribute  {Boolean} [commitOnReturn = false] 	  Flag que define se será realizado 
	 * <i>commit</i> automático dos comandos SQL ao finalizar a transação.
	 * @attribute  {Boolean} [rollbackOnReturn = false]   Flag que define se será realizado 
	 * <i>rollback</i> automático dos comandos SQL ao finalizar a transação.
	 * @example tx.beginTransaction({commitOnReturn: true});
	 */
	beginTransaction : function(params) {	
		params = params || {};
		this.rollbackOnReturn = params.rollbackOnReturn || false;
		this.commitOnReturn = (params.rollbackOnReturn == true 
				? false
				: (params.commitOnReturn || false));
	},
	/**
	 * Executa um <i>statement</i> SQL (DML).
	 * @param {String} sql
	 * @returns {Object} No caso do comando ser um SELECT retorna um array de objetos
		 * ou caso contrário um objeto com a propriedade <i>error</i> valorada com um booleano 
		 * <i>true</i> ou <i>false</i> de acordo com o resultado da execução do comando SQL.
	 */
	execute : function(sql) {
		return db.Database.execute(sql, this);
	},
	/**
	 * Realiza <i>commit</i> dos comandos SQL no banco de dados.
	 */
	commit : function() {
		this.connection.commit();
	},
	/**
	 * Realiza <i>rollback</i> dos comandos SQL no banco de dados.
	 */
	rollback : function() {
		this.connection.rollback();
	},
	/**
	 * Encerra a transação e devolve a conexão para o Pool de Conexões,
	 * caso autoCommit tenha sido passado como <i> true </i> no início da transação
	 * realiza <i>commit</i> dos comandos SQL, caso contrário realiza <i>rollback</i>.
	 */
	endTransaction : function() {
		if(this.commitOnReturn) 
			this.connection.commit();
		if(this.rollbackOnReturn) 
			this.connection.rollback();
		this.connection.setAutoCommit(true);
		this.connection.close();
	}
};

//..........................................................................................................................

/**
* Table &eacute; uma classe que representa uma tabela (entidade) de um banco de dados, 
* encapsulando m&eacute;todos de manipula&ccedil;&aacute;o da tabela, tais como, INSET, UPDATE, DELETE e 
* SELECT. 
* @param {string} tblName O nome da tabela a ser manipulada.
* @param {string} [keys = id]  As chaves primarias da tabela.
* @constructor
*/
db.Table = function (tblName, keys) {
    this.tableName = tblName;
    this.keys = keys || ["id"]	;
};

/**
 * Executa um comando SQL
 * @param {String}  sql String com o comando sql a ser executado.
 * @param {Transaction}  [transaction]  Transação em que será executado os comandos.
 * @returns {Object} No caso do comando ser um SELECT retorna um array de objetos
 * ou caso contrário um objeto com a propriedade <i>error</i> valorada com um booleano 
 * <i>true</i> ou <i>false</i> de acordo com o resultado da execução do comando SQL.
	 
 */
db.Table.execute = function(sql, transaction) {
    //java.lang.System.out.println(sql);
	var stmt = db.Database.createPrepareStatement(sql, transaction);
	var result = stmt.execute();
	stmt.close();
    return result;
};

/**
 * Realiza um comando replace no banco de dados.
 * @param {Object} tupla  Objeto a ser substituido.
 * @param {Transaction}  [transaction]  Transação em que será executado os comandos.
 * @returns
 */
db.Table.prototype.replace = function (tupla, transaction) { 
    var sqlReplace = 'REPLACE INTO ' + this.tableName + ' (';
    var values = ' VALUES (';
    var vrg = "", vals = [];

    for (var key in tupla) {
        vals.push(tupla[key]);
        sqlReplace += vrg + key;
        values += vrg + "?";
        vrg = ",";
    }
    sqlReplace += ') ' +  values + ')';
    var stmt = db.Database.createPrepareStatement(sqlReplace, transaction);
    var result = stmt.execute(vals);
    stmt.close();
    return result;
};

/**
 * Insere um ou mais objetos na tabela.
 * @param {Array|Object} itens         Array com objetos a serem inseridos na tabela, 
 * ou objeto único a ser inserido.
 * @param {Transaction}  [transaction] Transação em que será executado os comandos.
 * @return {Array|Object} Para inserção de varios itens retorna um Array de Objetos que 
 * indicam para cada item o resultado da execução do comando na base e a quantidade de linhas afetadas.
 * Para inserção de um único item retorna o id do item inserido.
 */
db.Table.prototype.insert = function (itens, transaction) { //}, returnGeneratedKey=true) {
    var sqlInsert = 'INSERT INTO ' + this.tableName + ' (';
    var values = ' VALUES (';
    var vrg = "", vals = [];
    
    if(itens.constructor.name == "Object") 
    	itens = [itens || {}];
    
    itens.forEach(function(tupla, idx) {
    	var props = [];
    	for (var key in tupla) {
            props.push(tupla[key]);
    		if(idx == 0) {
			   sqlInsert += vrg + key;
	           values += vrg + "?";
	           vrg = ",";
    		}
        }
    	vals.push(props);
	});
   
    sqlInsert += ') ' +  values + ')';
    var result, stmt = db.Database.createPrepareStatement(sqlInsert, transaction);
    if(vals.length > 1) 
    	result = stmt.executeRows(vals);
    else 
    	result = stmt.execute(vals[0]);
    stmt.close();
    return result;
};

/**
 * Atualiza dados da tabela no banco.
 * @param {Object}      row          Dados das colunas a serem atualizadas no banco de dados.
 * @param {Object}      where        Condição das colunas a serem atualizadas no banco de dados.
 * @param {Transaction} transaction  Transação na qual serão realizados os comandos no banco de dados.
 * @example <caption>Para atualizar na tabela empresa o campo nroFuncionarios para 250, aonde
 * o nome da empresa é Softbox utilizamos o seguinte comando: </caption> 
 *  tempresa.update({nroFuncionarios: 250},{empresa: "Softbox"});
 * @returns {Object} Objeto que informa o status da execução do comando e a quantidade de
 * linhas afetadas.
 */
db.Table.prototype.update = function(row, where, transaction) {
    var sql = 'UPDATE ' + this.tableName + ' SET ';
    var vrg = '', vals = [];
    for (var key in row) {
        vals.push(row[key]);
        sql += vrg + key + ' = ? ';
        vrg = ',';
    }
    
    var and = ' ';
    sql += ' WHERE ';
    if(where) {
    	for(var key in where) {
        	sql += and + key + " = ? ";
        	and = " AND ";
        	vals.push(where[key]);
        }
    } else {
    	this.keys.forEach(function(key, idx) {
    		sql +=  key + " = " + (row[key] || null);
    	});
    }
    
    var stmt = db.Database.createPrepareStatement(sql, transaction);
    var result = stmt.execute(vals);
    stmt.close();
    return result;
};

/**
 * Remove itens do banco de dados de acordo com o objeto passado
 * @param {Object}      row          Objeto que será usado como exemplo para realizar a consulta.
 * @param {Transaction} transaction  Transação na qual serão realizados os comandos no banco de dados.
 * @example <caption>Para remover de banco de dados todas as empresas do estado de Minas Gerais
 *  utilizamos o seguinte comando: </caption> 
 *  tempresa.deleteByExample({estado: "MG"});
 * @returns {Object} Informa o status da execução do comando e a quantidade de
 * linhas afetadas.
 */
db.Table.prototype.deleteByExample = function(row,transaction) {
    var sql = 'DELETE FROM ' + this.tableName + ' WHERE 1=1 ';
    var vals = [];
    
    for (var key in row) {
    	vals.push(row[key]);
        sql += ' AND ' + key + '= ?';
    }
    
    var stmt = db.Database.createPrepareStatement(sql, transaction);
    var result = stmt.execute(vals);
    stmt.close();
    return result;
};

/**
 * Remove determinado elemento do banco de dados, buscando o objeto por sua chave primaria.
 * @param {Object} row  Informação do objeto a ser removido
 * @param {Transaction} transaction  Transação na qual serão realizados os comandos no banco de dados.
 * @returns Informa o status da execução do comando e a quantidade de linhas afetadas.
 */
db.Table.prototype["delete"] = function(row, transaction) {
	var vals = {};
	this.keys.forEach(function(key, idx) {
		vals[key] = (row[key] != null ? row[key] : null);
	});
    return this.deleteByExample(vals, transaction);
};

/**
 * Seleciona determinado elemento do banco de dados, buscando o objeto por sua chave primaria.
 * @param {Object} row  Informação do objeto a ser buscado
 * @param {Transaction} transaction  Transação na qual serão realizados os comandos no banco de dados.
 * @returns {Array} Array que contem um objeto com o resultado da busca no banco de dados. 
 */
db.Table.prototype.selectByKey = db.Table.prototype.selectById;

/**
 * @deprecated Since version 0.2.8. You should now use selectByKey.
 */
db.Table.prototype.selectById = function(row, transaction) {
	var vals = {};
	this.keys.forEach(function(key, idx) {
		vals[key] = (row[key] != null ? row[key] : null);
	});
    return this.selectByExample(vals);
};

/**
 * Busca itens do banco de dados de acordo com o objeto passado
 * @param {Object}      row          Objeto que será usado como exemplo para realizar a consulta.
 * @param {Transaction} transaction  Transação na qual serão realizados os comandos no banco de dados.
 * @example <caption>Para buscar no banco de dados todas as empresas do estado de Minas Gerais
 *  utilizamos o seguinte comando: </caption> 
 *  tempresa.selectByExample({estado: "MG"});
 * @returns {Object} Informa o status da execução do comando e a quantidade de
 * linhas afetadas.
 */
db.Table.prototype.selectByExample = function(row, transaction) {
    var sql = 'SELECT * FROM ' + this.tableName + ' WHERE 1=1 ';
    var _and_ = ' AND ';
    var vals = [];
    
    for (var key in row) {
    	var val = row[key];
        vals.push(val);
        var op = "=";
        if (val == null) {
        	op = " is ";
        } else if(val.constructor.name == "String" && val.indexOf('%') >= 0) {
        	op = " like ";        
        }  
        sql +=  _and_  + key + op + " ? ";
    }
    var stmt = db.Database.createPrepareStatement(sql, transaction);
    var result = stmt.execute(vals);
    stmt.close();
    return result;
};

db.Table.prototype.search = db.Table.prototype.selectByExample;

/**
 * Busca todos os itens da tabela no banco de dados
 * @param {Transaction} [transaction]  Transação na qual serão realizados os comandos no banco de dados.
 * @example <caption>Para buscar no banco de dados todas as empresas: </caption> 
 *  tempresa.all();
 * @returns {Array} Array com os objetos que representam os dados buscados no
 * banco de dados.
 */
db.Table.prototype.all =  function(transaction) {
    var sql = 'SELECT * FROM ' + this.tableName;
    var stmt = db.Database.createPrepareStatement(sql, transaction);
    var result = stmt.execute();
    stmt.close();
    return result;
};


java.lang.System.out.println("database.pool.js loaded..............................................");