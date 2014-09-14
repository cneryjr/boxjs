binary.ByteString = function(byteArray) {
    this.value = byteArray;
};

binary.ByteString.prototype.toByteArray = function() {
    return this.value;
};

binary.ByteString.prototype.toString = function() {
    var byteArray = this.value;
    var str = "", i;
    for (i = 0; i < byteArray.length; ++i) {
        str += String.fromCharCode(byteArray[i]);
    }
    return str;
};

print("binary.js loaded...........................................");