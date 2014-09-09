// var recurse = module.exports;
var s = (process.platform === 'win32') ? '\\' : '/';

var fs = require('fs');

var findAll = function() {
  var wait = 0,
      pairs = [],
      ltls = [],

  read = function(path, level, callback) {

    function done() {
      return (!wait && level < 10 && level > 1);
    }

    fs.readdir(path, function(err,files) {

      files.forEach(function(file, i) {
        if (!file.match(/^\./)) {
          fs.stat(path + s + file, function(err, stats) {
            if (file.match(/(readme.md)|(README.md)/)) {
              var folder = getModuleName(path);
              pairs.push([path + s + file, pairLtl(folder)]);
            } else if (stats.isDirectory() && level < 10) {
              wait++;
              read(path + s + file, level++, callback);
            }
          });
        }
      })
      
      wait--;
      
      if (done()) {
        console.log(pairs.length)
        // return callback(null, pairs);
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
  }
  
  findLtls(process.cwd() + s + 'views', function(err, found) {
    if (!err && ltls.length > 0) {
      read(process.cwd(), 0, function(err, files) {
        console.log(files);
      });    
    }
  });


}

findAll();