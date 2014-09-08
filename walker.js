
exports.findAll = function(dir, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	var dircount 	= 0,
			folders 	= [],
			files 		= options.toJSON ? {} : [];



	function checkStats(stats, file, toRead, i, list, done) {
		if (stats.isDirectory()) {
			
			handleDirectory(file, toRead);

			return walk(toRead, done);

		} else if (stats.isFile()) {
			if (options.toJSON) {
				var tree = toRead.split(/[\/\\]/),
						parent = tree[tree.length - 2];

				if (parent === 'thumbs') {									
					var grandParent = tree[tree.length -3];
					files[grandParent][parent].push(toRead);

				} else if (files[parent] && 
									 files[parent].images instanceof Array) {

					files[parent].images.push(toRead);

				} else {
					// they're lowest level images (untouchables), 
					// and we don't want them in the JSON
				}

			} 
			else files.push(toRead);

			if (options.toJSON) {
				if (files.night && 
						files.night.thumbs instanceof Array && 
						i === list.length - 1) {
					return done(null,true);
				}
			}
			else if (i === list.length - 1) {
				console.log('should return without json');
				return done(null,true);
			}
		} else return done(err, false);
	}

	function handleDirectory(file, toRead) {
		folders.push(file);

			if (options.toJSON) {
				setFolder(toRead);
				dircount++;
			}
	}

	function walk(directory, done) {

		fs.readdir(directory, function(err, list) {
			if (err) return done(err, 'Luke dirwalker thinks there is no such directory');
			if (list.length > 0) {

				list.forEach(function(file,i) {
					var toRead = path.join(directory,file);

					fs.stat(toRead, function(err, stats) {
						checkStats(stats, file, toRead, i, list, done);
					});
				});
			}
		});		
	}

	function setFolder(folder) {

		var slash = process.platform === 'win32' ? '\\' : '/';
		

		var directory = folder.slice(folder.lastIndexOf(slash) + 1),
				origin 		= dir.slice(dir.lastIndexOf(slash) + 1),
				parent 		= folder.slice(0,folder.lastIndexOf(slash)).split(slash);
				parent 		= parent[parent.length - 1];


		if (directory === origin) return true;
		
		else if (parent && parent !== origin) {
			files[parent] = files[parent] || {};
			files[parent][directory] = [];

			if (files[parent][directory]) return true;
			else return false;
		}
		else {
			files[directory] = files[directory] || { images: [] };
			if (files[directory]) return true;
			else return false;
		}
	}

	
	dir = path.normalize(dir);
	walk(dir, function(err, done) {
		if (err) {
			console.error(err);
			return callback(err, done);
		} else return callback(null, files);
	});
}
