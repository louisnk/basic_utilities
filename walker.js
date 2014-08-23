
exports.findAll = function(dir, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	
	var files = options.toJSON ? {} : [];
	var dircount = 0;

	function walk(directory, done) {

		fs.readdir(directory, function(err, list) {
			if (err) return done(err, 'Luke dirwalker thinks there is no such directory');
			list.forEach(function(file,i) {
				var toRead = path.join(directory,file);
				fs.stat(toRead, function(err, stats) {
					if (stats.isDirectory()) {
						
						if (options.toJSON) {
							setFolder(toRead);
							dircount++;
						} 

						walk(toRead, done);

					} else if (stats.isFile()) {
						
						if (options.toJSON) {
							var tree = toRead.split(/[\/\\]/),
									parent = tree[tree.length - 2];
							if (files[parent] instanceof Array) {
								files[parent].push(toRead);
							}
						} 
						else files.push(toRead);
						if (options.toJSON) {
							if (i === list.length - 1 && dircount === Object.keys(files).length) {
								return done(null,true);
							}
						}
						if (!options.toJSON && i === list.length - 1) {
							return done(null,true);
						}
					} else return done(err, false);
				});
			});
		});		
	}

	function setFolder(folder) {
		var dir = folder.slice(folder.lastIndexOf('\\') + 1);
		if (dir === 'images') return true;
		else {
			files[dir] = [];
			if (files.dir) return true;
		}
	}

	
	dir = path.normalize(dir)
	walk(dir, function(err, done) {
		if (err) {
			return callback(err, done);
		} else 
			return callback(null, files);
	});
}
