var BasicDBObject = Java.type('com.mongodb.BasicDBObject');
var HashMap = Java.type('java.util.HashMap');
var WriteConcern = Java.type('com.mongodb.WriteConcern');

var BSON = {
    to: function(object) {
        
        if (object instanceof RegExp) {
            var bson = new BasicDBObject();
            var opts = (object.global) ? 'g' : '';
            
            opts += (object.ignoreCase) ? 'i' : '';
            opts += (object.multiline) ? 'm' : '';
            bson.put("$regex", object.source);
            bson.put("$options", opts);
            
            return bson;
            
        } else if (object instanceof Array) {
            bson = new java.util.ArrayList();
            for(var i = 0; i < object.length; i++)
                bson.add( BSON.to(object[i]) );

            return bson;
            
        // deprecated    
        //} else if (object === undefined) {
        //    return new BasicDBObject().append("$undefined", true);        

        } else {
            //var bson = new BasicDBObject();
            // bson.putAll(object);
            if (object.constructor.toString().indexOf("function Object") === 0) {
                var bson = new BasicDBObject();
                for (var k in object) {
                   bson.put(k, BSON.to(object[k])); 
                }
                return bson;
            } else {
                return object;
            }
        }
    }
};

/** 
 * Agrupa funcionalidades relativas ao servidor de banco de dados. 
 * 
 * @namespace Database
 * @memberof db 
 */
db.MongoDB = {
    
    client: mongodb,
    
    WriteConcern: WriteConcern,    

    getClient: function() {
        //this.client = new com.mongodb.MongoClient( "localhost" , 27017 );
        return this.client;
    },

    getDB: function(dbName) {
        var MongoDatabase = function() {
            //print("mongodb ==>> " + mongodb)
            this.db = db.MongoDB.client.getDB(dbName);
        };
        MongoDatabase.prototype = MDatabase;
        return new MongoDatabase();
    },
    
    setWriteConcern: function(WriteConcernMode) {
        db.MongoDB.client.setWriteConcern(WriteConcernMode);  
    }
    
};
//db.MongoDB.setWriteConcern(WriteConcern.JOURNALED);

var MDatabase = {
    getCollection: function(collectionName) {
        var db = this.db;
        var MongoCollection = function() {
            this.collection = db.getCollection(collectionName);
        };
        MongoCollection.prototype = MCollection;
        return new MongoCollection();
    },
        
    getName: function() {
        return this.db.getName();
    }
};


/**
 * A MongoDB collection. This is a lightweight wrapper that can be created as often as is needed.
 * Resources per specific collection are managed centrally by the MongoDB connection, no
 * matter how many of these wrappers are created per collection.
 * 
 * @class
 * 
 * @param {String} name The collection name
 */
var MCollection = {
    /**
     * Inserts a document, creating a default _id if not provided.
     * 
     * @param document The document to insert
     * @returns See {@link MongoDB#result}
     * @see #save
     */    
    insert: function(document) {
        return this.collection.insert(BSON.to(document));
    },
    
    /**
     * Creates a cursor to iterate over one or more documents.
     * 
     * @param query The query
     * @param [fields] The fields to fetch
     * @returns {MongoCursor}
     */
    find: function (query, fields) {
        var qry = new BasicDBObject();
        var keys = new BasicDBObject();
        
        if (query)
            qry = BSON.to(query);
        if (fields)
            keys.putAll(fields);

        var cursor = this.collection.find(qry, keys);

        return new MongoCursor(cursor);
    },

    /**
     * Counts documents without fetching them.
     * 
     * @param [query] The query or else count all documents
     * @returns {Number}
     */
    count: function(query) {
        return this.find(query).count();
    },

    /**
     * Finds all distinct values of field.
     * 
     * @param {String} field
     * @param [query] The query or null
     * @param [readPreference] See {@link MongoDB#readPreference}
     * @returns {Array}
     */
    distinct: function(field, query) {
        if (query === undefined) {
            return this.collection.distinct(field);
        } else {
            return this.collection.distinct(field, BSON.to(query));
        }
    },

    /**
     * Removes all documents matching the query.
     * 
     * @param query The query
     * @param [writeConcern] See {@link MongoDB#writeConcern}
     * @returns See {@link MongoDB#result}
     * @see #findAndRemove
     */    
    remove: function(query) {
        var qry = new BasicDBObject();
        
        if (query)
            qry = BSON.to(query);

        return this.collection.remove(qry);
    },
    
    /**
     * Updates one or more documents.
     * 
     * @param query The query
     * @param update The update
     * @param [options]
     * @param {Boolean} [options.upsert=false]
     * @param {Boolean} [options.multi=false] True to update all documents, false 
     *         to update only the first document matching the query.
     * @returns See {@link MongoDB#result}
     * @see #upsert
     */    
    update: function(query, update, options) {
        options = options || {};        
        var upsert = options.upsert || false;
        var multi = options.multi || false;
        var concern = (options.writeConcern) ? options.writeConcern : this.collection.getWriteConcern();
        var qry = new BasicDBObject();
        var updt = BSON.to(update);

        if (query)
            qry = BSON.to(query);        
        
        return this.collection.update(qry, updt, upsert, multi, concern);
    },
    
    /**
     * Calculates aggregate values for the data in a collection.
     * 
     * @param {Array} pipeline A sequence of data aggregation operations or stages.
     * @param {Object} [options] Optional. Additional options that aggregate() 
     *         passes to the aggregate command.
     * @returns See {MongoCursor}
     */    
    aggregate: function(pipeline, options) {
        var jopr, jpip = new java.util.ArrayList();
        
        pipeline.forEach(function(opr){
            (jopr = new BasicDBObject()).putAll(opr);
            jpip.add(jopr);
        });
        options = options ? (new BasicDBObject()).putAll(options) : null;
                
        return this.collection.aggregate(jpip, options);
    },

    /**
     * Returns the name of this collection.
     * 
     * @returns the name of this collection
     */
    getName: function () {
        return this.collection.getName();
    }

};

var MCursor = {
    /**
     * Iterates the cursor to apply a JavaScript function to each document from the cursor.
     * 
     * @param {type} fnc A JavaScript function to apply to each document from 
     *         the cursor. The <function> signature includes a single argument 
     *         that is passed the current document to process.
     */
    forEach: function(fnc) {
        this.cursor.forEach(fnc);
    },
    /**
     * Pulls back all items into an array and returns the number of objects. Note: this can be resource intensive
     * @returns {Number} the number of elements in the array
     */
    get length() {
        return this.cursor.length();
    },
    
    /**
     * Sets the maximum number of documents to iterate. 
     * 
     * @param {Number} n The limit
     * @returns {MongoCursor} This cursor
     */    
    limit: function(n) {
        this.cursor.limit(n);
        return this;
    },
    
    /**
     * Moves the cursor forward without fetching documents.
     * 
     * @param {Number} n The number of documents to skip
     * @returns {MongoCursor} This cursor
     */    
    skip: function(n) {
        this.cursor.skip(n);
        return this;
    },
    
    /**
     * Counts the number of objects matching the query This does not take limit/skip into consideration.
     * 
     * @returns {Number} The number of objects
     */
    count: function() {
        return this.cursor.count();
    },
    
    /**
     * Sorts this cursor's elements. This method must be called before getting any object from the cursor.
     * 
     * @param {type} orderBy the fields by which to sort
     * @returns {MCursor} a cursor pointing to The first element of the sorted results
     */
    sort: function(orderBy) {
        var rec;
        
        (rec = new BasicDBObject()).putAll(orderBy);
        this.cursor.sort(rec);
        return this;
    },
    
    /**
     * Converts this cursor to an array.
     * 
     * @param {Number} max
     * @returns {Array}
     */
    toArray: function(max) {
        //print("MCursos.toArray => " + this.cursor.toArray());
        
        if (max == undefined)
            return this.cursor.toArray();
        else
            return this.cursor.toArray(max);
    },
    
    /**
     * Checks if there is another object available
     * 
     * @returns {Boolean} True if there are more documents to iterate
     * @see #next
     */
    hasNext: function() {
        return this.cursor.hasNext();
    },
    
    /**
     * Returns the object the cursor is at and moves the cursor ahead by one.
     * 
     * @returns {Object} the next element
     * @see #hasNext
     */
    next: function() {
        return this.cursor.next();
    },
    /**
     * kills the current cursor on the server.
     */
    close: function() {
        this.cursor.close();
    }
    
};

/**
 * A MongoDB cursor. You usually do not have to create instances of this class
 * directly, because they are returned by {@link MCollection#find}. Note
 * that you do not have to call {@link #close} if you are exhausting the cursor
 * with calls to {@link #next}.
 * 
 * @class
 * @param {com.mongodb.DBCursor} cursor The JVM cursor
 */
var MongoCursor = function(cursor) {
    this.cursor = cursor;
};
MongoCursor.prototype = MCursor;

