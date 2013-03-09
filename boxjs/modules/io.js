io.FileSystem = {
    getStream: function(path, type) {
        var stream = Packages.sbx.boxjs.modules.io.Stream.create(path, type);
        return stream; 
    },

    getTextStream: function(path, type) {
        var stream = Packages.sbx.boxjs.modules.io.TextStream.create(path, type);
        return stream; 
    }
};

/********************************* io.Stream **********************************/
io.Stream = function(path, type) {
    this.path = path;
    this.stream = io.FileSystem.getStream(path, typeof type !== 'undefined' ? type : "R");
    this.length = this.stream.length();
    this.position = 0;
};

io.Stream.prototype.readable = function() {
    return this.stream.readable();
};

io.Stream.prototype.writable = function() {
    return this.stream.writable();
};

io.Stream.prototype.seekable = function() {
    return this.stream.seekable();
};

io.Stream.prototype.close = function() {
    this.stream.close();
};

io.Stream.prototype.closed = function() {
    return this.stream.closed();
};

io.Stream.prototype.flush = function() {
    this.stream.flush();
};

io.Stream.prototype.skip = function(n) {
    var result = this.stream.skip(n);
    this.position = this.stream.position();
    return result;
};

io.Stream.prototype.read = function(n) {
    var arr = new binary.ByteString(this.stream.read(n || -1));
    this.position = this.stream.position();
    return arr;
};

io.Stream.prototype.write = function(source) {
    this.stream.write(source);
};

io.Stream.prototype.copy = function(output) {
    output.write(this.read(null).toByteArray());
};

/********************************* io.TextStream **********************************/
io.TextStream = function(path, type) {
    this.path = path;
    this.stream = io.FileSystem.getTextStream(path, typeof type !== 'undefined' ? type : "R");
};

io.TextStream.prototype.readable = function() {
    return this.stream.readable();
};

io.TextStream.prototype.writable = function() {
    return this.stream.writable();
};

io.TextStream.prototype.seekable = function() {
    return this.stream.seekable();
};

io.TextStream.prototype.close = function() {
    this.stream.close();
};

io.TextStream.prototype.closed = function() {
    return this.stream.closed();
};

io.TextStream.prototype.flush = function() {
    this.stream.flush();
};

io.TextStream.prototype.skip = function(n) {
    return this.stream.skip(n);
};

io.TextStream.prototype.readLine = function() {
    return this.stream.readLine();
};

io.TextStream.prototype.readLines = function() {
    var result = new Array();
    var line;
    while ((line = this.stream.readLine()) != null) {
        result.push(line);
    }
    return result;
};

io.TextStream.prototype.writeLine = function(line) {
    this.stream.writeLine(line);
};

io.TextStream.prototype.print = function() {
    for (var i=0; i<arguments.length; i++) {
        this.writeLine(arguments[i]);
    }
};

io.TextStream.prototype.iterator = function() {
    return Iterator(this.readLines());
};

io.TextStream.prototype.next = function() {
    var line = this.readLine();
    if (line == null) {
        throw StopIteration;
    }
    return line;
};

io.TextStream.prototype.copy = function(output) {
    var line;
    while ((line = this.stream.readLine()) != null) {
        this.writeLine(line);
    }
};

print("io.js loaded...........................................");