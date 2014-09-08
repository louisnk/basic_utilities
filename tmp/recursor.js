// var recurse = module.exports;
var slash = (process.platform === 'win32') ? '\\' : '/';
var fs = require('fs');

var findAll = function() {
  var dirs = 0,
      depth = 0,
      pairs = [],
      ltls = [],

  read = function(path, level, callback) {
    console.log(dirs);
    fs.readdir(path, function(err,files) {
      files.forEach(function(file, i) {
        if (!file.match(/^\./)) {
          fs.stat(path + slash + file, function(err, stats) {
            if (stats.isDirectory()) {
              dirs++;
              read(path + slash + file, level++, callback);

            } else if (file.match(/(readme.md)|(README.md)/)) {
              var folder = getModuleName(path + slash + file);
              // console.log(pairLtl(folder));
              pairs.push([path + slash + file, pairLtl(folder)]);
            }
          });
        }
        if (i === files.length - 1) {
          dirs--;
          if (dirs === 0) {
            return callback(null, pairs);
          }
        }

      })
    })
  },

  // I feel like this could probably be a regex, 
  // but is a little beyond my regex ability.
  getModuleName = function(path) {
    var a = path.slice(0, path.lastIndexOf(slash)),
        b = a.slice(a.lastIndexOf(slash) + 1);

    return b;
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
  
  findLtls(process.cwd() + slash + 'views', function(err, done) {
    if (!err) 
      read(process.cwd(), depth, function(err, files) {
      console.log(files);
    });    
  });


}

findAll();