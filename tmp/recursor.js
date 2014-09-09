// var recurse = module.exports;
var s = (process.platform === 'win32') ? '\\' : '/';

var fs = require('fs');

var findAll = function(callback) {
  var wait = 0,
      pairs = [],
      ltls = [],

  read = function(path, level) {
    wait++;

    function finished() {
      return (!wait && level <= 10 && level > 0);
    }

    fs.readdir(path, function(err,files) {
      if (err) return callback(err);
      
      files.forEach(function(file, i) {
        if (!file.match(/^\./)) {
          fs.stat(path + s + file, function(err, stats) {
            if (file.match(/(readme.md)|(README.md)/)) {
              var folder = getModuleName(path);
              pairs.push([path + s + file, pairLtl(folder)]);
            } else if (stats.isDirectory() && level < 10) {

              // also tried wait++ here, but made no difference?

              read(path + s + file, level++);
            }
          });
        }
      })
      
      // Where should this decrement be happening?
      // Seems like right here it's done looping through this directory?

      wait--;
      
      if (finished()) {
        return callback(null,pairs);
      }

    })
  },

  getModuleName = function(path) {
    return path.slice(path.lastIndexOf(s) + 1);
  },

  findLtls = function(views, callback) {
    fs.readdir(views, function(err, files) {
      if (err) return callback(err);

      files.forEach(function(file, i) {
        if (file.slice(-3) === 'ltl') {
          ltls.push(file);
        }
        if (i === files.length - 1) {
          return callback(null,true);
        }
      })
    })
  },

  pairLtl = function(module) {
    for (var i = 0; i < ltls.length; i++) {
      if (ltls[i].match(module)) {
        return ltls[i];
      }
    }
    return '';
  },

  // return original callback?
  returnFiles = function(err) {
    if (!err) return callback(null,pairs);
    return callback(err);
  }
  
  findLtls(process.cwd() + s + 'views', function(err, found) {
    if (!err && ltls.length > 0) {
      read(process.cwd(), 0);
    }
  });


}

findAll();