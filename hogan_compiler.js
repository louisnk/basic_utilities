var fs = require('fs'),
		hogan = require('hjs'),
		path = require('path');

exports.makeTemplates = function(dir, list, callback) {
	var templates = [];
	
	function getShortFileName(fileName) {
		var s = (process.platform === 'win32') ? '\\' : '/',
				lastSlashIndex = fileName.lastIndexOf(s) + 1;

		return fileName.substr(lastSlashIndex, fileName.lastIndexOf(".") - lastSlashIndex);
	}

	list.forEach(function(file,i) {
		var pieces = file.split('.'),
				name = getShortFileName(file);

		if (pieces[1] === 'html') {

			fs.readFile(file, {'encoding': 'utf8'}, function(err, data) {
				if (err) throw err;
        
				if (i === 0) templates += "var APP=window.APP||{}; (function(){APP.templates={";
						
					templates += name + ": new Hogan.Template(" + 
											 hogan.compile(data, {asString: true}) + '),';

				if (i === list.length - 1) {
          
          templates = templates.slice(0,-1) + "}})();"

					dir = path.join(__dirname, '..', 'views');
					fs.writeFile(path.join(dir, 'templates.js'), templates, function(err) {
						if (err) return callback(err, 'failed to compile or save template files');
						else {
							return callback(null,true);
						}
					});
				}
			});
		}
	});
}