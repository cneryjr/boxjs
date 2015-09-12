var Files = Java.type('java.nio.file.Files');
var Path = Java.type('java.nio.file.Path');
var Paths = Java.type('java.nio.file.Paths');
var StandardCopyOption = Java.type('java.nio.file.StandardCopyOption');
var FileVisitor = Java.type('java.nio.file.FileVisitor');
var FileVisitResult = Java.type('java.nio.file.FileVisitResult');
var SimpleFileVisitor = Java.type('java.nio.file.SimpleFileVisitor');

var fileio = fileio || {};

/**
 * @param {String} srcDir - Diretório fonte 
 * @param {String} trgDir - Diretório destino 
 */
fileio.copyDirectory = function(srcDir, trgDir) {

    var srcPath = Paths.get(srcDir);

    try {
        Files.walkFileTree(srcPath, new FileVisitor({

            preVisitDirectory: function(dir, attrs) {
                var newdir = Paths.get(trgDir).resolve(srcPath.relativize(dir));
                
                if (! Files.exists(newdir))
                    Files.copy(dir, newdir, StandardCopyOption.REPLACE_EXISTING);
                return FileVisitResult.CONTINUE;
            },
            
            visitFile: function(file, attrs) {
                var newdir = Paths.get(trgDir).resolve(srcPath.relativize(file.getParent()));
                
                Files.copy(file, newdir.resolve(file.getFileName()), StandardCopyOption.REPLACE_EXISTING);
                return FileVisitResult.CONTINUE;
            },

            postVisitDirectory: function(dir, exc) {
                return FileVisitResult.CONTINUE;
            }
        }));
    } catch (e) {
        e.printStackTrace();
    }
};
