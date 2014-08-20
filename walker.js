var fs = require('fs');
var path = require('path');

exports.findAll = function(dir, callback) {
	
	var templates = [];

	function walk(directory, done) {

		fs.readdir(directory, function(err, list) {
			if (list.length > 0) {
				list.forEach(function(file,i) {
					var toRead = path.join(directory,file);
					fs.stat(toRead, function(err, fileInfo) {
						if (fileInfo.isDirectory()) {
							walk(toRead, done);
						} else if (fileInfo.isFile()) {
							templates.push(toRead);
							if (i == list.length - 1) {
								return done(null,true);
							}
						} else return done(err, false);
					});
				});
			} else {
				return done(null, 'No files in directory');
			}
		});		
	}

	dir = path.normalize(dir)
	walk(dir, function(err, done) {
		if (done) {
			return callback(null, templates);
		} else 
			return callback(err, "Luke directory walker failed!");
	});
}