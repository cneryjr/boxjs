function setTimeout() {}
function clearTimeout() {}
var window = {
    document: {
        scripts: [{
            name: "mongodb_test.js", 
            attributes: {nodeName: "data-cover-only"}
        }]
    }
};

function extend(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
}

//var jasmine = require('modules/jasmine-box.js').jasmine;
var jasminePackage = require('modules/jasmine-box.js');
var jasmine = jasminePackage.jasmine;
var jasmineInterface = jasminePackage.jasmineInterface;
var env = jasminePackage.env;

extend(this, jasmineInterface);

//var esprima = require('modules/esprima/esprima.js');
//print("esprima: " + esprima);
//
//var falafel = require('modules/blanket/falafel.js');
//print("falafel: " + falafel);
//
//var blanket = require('modules/blanket/blanket.js');
//require('modules/jasmine/jasmine-2.x-blanket.js');
//print("blanket: " + blanket);

//print("Boolean: " + typeof window !== 'undefined');
//var blanket = require('modules/blanket/blanket_jasmine.js');
//var blanket = require('modules/blanket/blanket.js');

var rep;
var options = {
    showColors: true,
    timer: new jasmine.Timer,
    print: function () {
//      console.log.apply(console, arguments)
        print.apply(null, arguments)
    }
};

jasmine.getEnv().addReporter(rep = new jasmine.ConsoleReporter(options));


describe("Módulo MongoDB ", function () {
    var dbTest;
    var emps;
    var c;
    var reg;
    
    it("seleciona o database ('test') a ser manipulado através do getDB ", function () {
        dbTest = db.MongoDB.getDB("test");
        expect(dbTest).not.toBe(null)
        expect(dbTest.getName()).toBe("test")
    });
    
    it("seleciona a collection 'empresas' para manipulação dos dados ", function () {
        emps = dbTest.getCollection("empresas");
        
        expect(emps).not.toBe(null)
        expect(emps.getName()).toBe("empresas")
    });

    describe("Utilizando a collection 'empresas' ", function () {
        it("remover todos os registros da collection ", function () {
            emps.remove();
            expect(emps.count()).toBe(0);
        });
        
        it("inserir um único registro na collection ", function () {
            emps.insert({
                "nome": "SBX",
                "razaoSocial": "SBX", 
                "codigo": 400000,
                "sede": "Salvador",
                "infos": {
                    "colaboradores": 25,
                    "codigo": "xpta"
                }
            });
            expect(emps.count()).toBe(1);
        });
        
        it("inserir vários registros na collection em um único comando de insert ", function () {
            emps.insert([
                { "nome": "BHX", "razaoSocial": "BHX", "codigo": 600000, "sede": "Belo Horizonte", "infos": { "colaboradores": 20, "codigo": "xpto" } },
                { "nome": "ROCAVIN", "razaoSocial": "Rocav", "codigo": 200000, "sede": "Uberlandia", "infos": { "colaboradores": 50, "codigo": "grama" } },
                { "nome": "SOFTBOX", "razaoSocial": "Softbox", "codigo": 100000, "sede": "Uberlandia", "infos": { "colaboradores": 60, "codigo": "oleo" } }
            ]);
            expect(emps.count()).toBe(4);
        });

        it("contar o total de registros na collection ", function () {
            expect(emps.count()).toBe(4);
            expect(emps.find().count()).toEqual(4);
        });

        describe("Encontrar documento(s) ", function () {
            it("a partir de valor(es) idêntico(s) ", function () {
                c = emps.find({nome: "BHX"}); 
                expect(c.count()).toBe(1);
                expect(c.next().nome).toEqual("BHX");
            });
            
            it("utilizando expressão regular ", function () {
                var c = emps.find({nome: {$regex: "^SBX"}}); 
                expect(emps.find({nome: /^SBX/}).count()).toBe(1);
                expect(emps.find({nome: /sbx/gi}).count()).toEqual(1);
                expect(c.next().nome).toBe("SBX");
            });

            it("utilizando array (ex: $in, $or etc) ", function () {
                c = emps.find({$or: [{nome: "SBX"}, {nome: "BHX"}]});
                expect(c.count()).toEqual(2);
                expect(emps.find({$or: [{nome: /sbx/gi}, {nome: "BHX"}]}).count()).toEqual(2);
                expect(emps.find({razaoSocial: {$in: ["Softbox", "BHX"]}}).count()).toEqual(2);
            });
        });        

        describe("Alterar documento(s) que correpondem a um critério de pesquisa ", function () {
                       
            it("sobrepondo todo o conteúdo do documento ", function () {
                emps.update(
                   { nome: "SBX" },
                   {
                      nome: "SBX",
                      razaoSocial: "SBX Ltda",
                      codigo: 999,
                      sede: "Vitoria da Conquista"
                   },
                   { upsert: false });                 
                expect(emps.count()).toEqual(4);
                expect(emps.find({codigo: 999}).count()).toEqual(1);
                expect(emps.find({sede: /Conquista/gi}).count()).toEqual(1);
            });
            
            it("alterando/acrescentando algum(uns) campo(s) de um documento ", function () {
                emps.update(
                   { nome: "SBX" },
                   {
                     $set: {
                        sede: "Belo Horizonte",
                        lixo: "trash",
                        infos: {
                            "colaboradores": 27,
                            "codigo": "xpta"
                        }
                     }
                   },
                   { upsert: false });    
                reg = emps.find({ nome: "SBX" }).next();
                
                expect(emps.count()).toEqual(4);
                expect(emps.find().count()).toEqual(4);
                expect(reg.lixo).toBe("trash");
                expect(reg.sede).toBe("Belo Horizonte");
            });

            it("alterando/acrescentando algum(uns) campo(s) de vários documentos ", function () {
                var wr = emps.update(
                   { sede: /uberlandia/gi },
                   {
                     $set: {
                        lixo: "trash",
                        "infos.codigo": "changed"
                     }
                   },
                   { upsert: false, multi: true, writeConcern: db.MongoDB.WriteConcern.SAFE }); //.MAJORITY });  // .ACKNOWLEDGED }); // 

                reg = emps.find({ sede: /uberlandia/gi }).next();
                //print("wr:" + wr);
                // wr:{ "serverUsed" : "localhost:27017" , "ok" : 1 , "n" : 2 , "updatedExisting" : true}
                // print("wr.ok(" + wr.ok +") " + typeof(wr.ok));         
                expect(wr.n).toBe(2);
                expect(wr.getN()).toBe(2);
                expect(emps.count()).toEqual(4);
                expect(emps.find().count()).toEqual(4);
                expect(reg.lixo).toBe("trash");
                expect(reg.infos.codigo).toBe("changed");
            });

            it("apagando campos do documento ", function () {
                emps.update(
                   { nome: "SBX" },
                   {
                     $unset: {
                        lixo: "Belo Horizonte"
                     }
                   });
                reg = emps.find({ nome: "SBX" }).next();
                
                expect(emps.count()).toEqual(4);
                expect(emps.find().count()).toEqual(4);
                expect(reg.sede).toEqual("Belo Horizonte");
                expect(reg.lixo).toBe(null);
            });

            it("inserindo quando o documento não existir ", function () {
                emps.update(
                   { nome: "NEWCORP" },
                   {
                      nome: "NEWCORP",
                      razaoSocial: "NEWCORP Ltda",
                      codigo: 555,
                      sede: "SP"
                   },
                   { upsert: true });                 
                expect(emps.count()).toBe(5);
                expect(emps.find().count()).toBe(5);
                expect(emps.find({nome: "NEWCORP"}).count()).toBe(1);
                expect(emps.find({nome: "NEWCORP"}).next().codigo).toBe(555);
            });
            
        });

        it("listar os nomes de todas as empresas existentes na collection ", function () {
            var list5 = emps.distinct('nome');
            expect(list5.length).toBe(5);
        });

        it("listar os nomes de das empresas de uma determinada localidade ", function () {
            expect(emps.distinct('nome',{sede: "Uberlandia"}).length).toBe(2);
        });


    });
    
    describe("Próxima suite de testes ", function () {
        it("ainda a ser desenvolvida... ", function () {
            expect(true).toBe(true);
        });

        it("ainda a ser desenvolvida 2... ", function () {
            expect(true).toBe(true);
        });
    });

});

jasmine.getEnv().execute(); 


/*
describe("A spec", function () {
    var foo;

    beforeEach(function () {
        foo = 0;
        foo += 1;
    });

    afterEach(function () {
        foo = 0;
    });

    it("is just a function, so it can contain any code", function () {
        expect(foo).toEqual(1);
    });

    it("can have more than one expectation", function () {
        expect(foo).toEqual(1);
        expect(true).toEqual(true);
    });

    describe("nested inside a second describe", function () {
        var bar;

        beforeEach(function () {
            bar = 1;
        });

        it("can reference both scopes as needed", function () {
            expect(foo).toEqual(bar);
        });
    });
});
*/

// Tell require where it's root is
//require.root = ['/Users/nery/DEV/boxjs/web/boxjs/'];

http.response.write("<h2>Fim!<h2>");
print('Fim');
