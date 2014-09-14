/* EXEMPLOS DO MODULO DE DATABASE */

/* CREATE TABLE `tab_cidade` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`cidade` CHAR(128) NOT NULL DEFAULT '',
	`estado` CHAR(2) NOT NULL DEFAULT '',
	`pais` CHAR(128) NOT NULL DEFAULT '',
	`fundacao` DATE NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
) */

/* Utilizando o controle de transa��o */
var tx = db.Database.getTransaction();
tx.getConnection();
tx.beginTransaction({rollbackOnReturn: true});

var tcidade = new db.Table("tab_cidade");
var udi = {cidade: "Uberlandia", estado: "MG", pais: "Brasil", fundacao: "1888-08-31"};
var ara = {cidade: "Araguari", estado: "MG", pais: "Brasil", fundacao: "1888-08-31"};
var ny = {cidade: "Nova Yorque", estado: "-", pais: "USA", fundacao: "1888-08-31"};
var bar = {cidade: "Barcelona", estado: "--", pais: "Espanha", fundacao: "1888-08-31"};

var rs = tcidade.insert([udi,ny], tx);
rs = rs.concat(tcidade.insert(bar, tx));
tx.commit();

tcidade.insert(ara, tx);

tx.endTransaction();
global.response.write("<h3> Inseridos </h3>" + JSON.stringify(rs));

/* Utilizando as apis */
var tcidade2 = new db.Table("tab_cidade",["id","cidade","estado","pais"]);

var udi = tcidade2.selectByExample({pais: "Brasil"});

var key = tcidade2.selectById({id:90,cidade: "Uberlandia",estado: "MG", pais: "Brasil", fundacao: "1888-08-31"});

tcidade2.insert(ara);
tcidade2.update({cidade: "Rio de Janeiro", estado: "RJ"},{cidade: "Araguari"});

tcidade2.insert(ara);

var todos = tcidade2.all();

global.response.write("<br><hr><h3> Select by Example </h3>" + JSON.stringify(udi));

global.response.write("<br><hr><h3> Select by id </h3>" + JSON.stringify(key));

global.response.write("<br><hr><h3> Select all </h3>" + JSON.stringify(todos));



