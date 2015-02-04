global.fs = require("fs");
global.path = require("path");

var express = require("express");
var http = require("http");

var app = express();

app.set("port", process.argv[2] || 4900);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
	var index = path.join(__dirname, "views", "index.html");
	fs.readFile(index, { "encoding": "utf8" }, function(err, file) {
		if (!err) {
			res.end(file, "utf8");
		} else {
			res.end("Failed to find index.html, are you sure it's there?");
		}
	});
});

http.createServer(app).listen(app.get("port"), function() {
	console.log("Let's react - poke me at " + app.get("port"));
});