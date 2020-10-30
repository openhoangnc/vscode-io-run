/**
 * Read file line by line "synchronous"
 * 
 * require nodejs ~0.11, run with "node --harmony"
 *
 * Example: 
 *
 * var readLineSync = require('./readLineSync');
 * 
 *
 * for( var i of readLineSync('test.txt', 'utf8') ) {
 *     console.info(i);
 * } 
 *
 *
 * Author: Basem Mostafa, http://dbasem.com/
 * License: MIT
 */


var fs = require('fs'),
    os = require('os');


/**
* Get a line from buffer & return it + remaining buffer
*
* @param {Buffer} buffer
*/
function getLine(buffer) {
    var i, line, newBuffer, end;

    for (i = 0; i < buffer.length; i++) {
        //detect '\n'
        if (buffer[i] === 0x0a) {

            //remove \r
            if (i > 0 && buffer[i - 1] == 0x0d) {
                end = i - 1;
            } else {
                end = i;
            }

            return {
                line: buffer.slice(0, end).toString(),
                newBuffer: buffer.slice(i + 1)
            }
        }
    }

    return null;
}

/**
* Read file line by line synchronous
* 
* @param {String} path
* @param {String} encoding - "optional" encoding in same format as nodejs Buffer
*/
module.exports = function* readLineSync(path, encoding) {
    var fsize,
        fd,
        chunkSize = 64 * 1024, //64KB
        bufferSize = chunkSize,
        remainder,
        curBuffer = Buffer.alloc(0),
        readBuffer,
        numOfLoops;

    if (!fs.existsSync(path)) {
        throw new Error("no such file or directory '" + path + "'");
    }

    fsize = fs.statSync(path).size;

    if (fsize < chunkSize) {
        bufferSize = fsize;
    }

    numOfLoops = Math.floor(fsize / bufferSize);
    remainder = fsize % bufferSize;

    fd = fs.openSync(path, 'r');

    for (var i = 0; i < numOfLoops; i++) {
        readBuffer = Buffer.alloc(bufferSize);

        fs.readSync(fd, readBuffer, 0, bufferSize, bufferSize * i);

        curBuffer = Buffer.concat([curBuffer, readBuffer], curBuffer.length + readBuffer.length);

        while (lineObj = getLine(curBuffer)) {
            curBuffer = lineObj.newBuffer;
            yield lineObj.line;
        }
    }

    if (remainder > 0) {
        readBuffer = Buffer.alloc(remainder, encoding);

        fs.readSync(fd, readBuffer, 0, remainder, bufferSize * i);

        curBuffer = Buffer.concat([curBuffer, readBuffer], curBuffer.length + readBuffer.length);
        var lineObj;
        while (lineObj = getLine(curBuffer)) {
            curBuffer = lineObj.newBuffer;
            yield lineObj.line;
        }
    }

    //return last remainings in the buffer in case
    //it didn't have any more lines
    if (curBuffer.length > 0) {
        yield curBuffer.toString();
    }
}