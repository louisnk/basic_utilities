##basic utilities


Just random JS utilities I've made, some Node.js, some front end. Currently built to work with windows paths...


#hogan_compiler

Takes a bunch of HTML template files written in Hogan (basically mustache) and concatenates them all into a single JS file which gets written to disk in the views folder, to be served as your compiled templates and rendered on the front end (or server-side, if you please).

Parameters: (dir, list, callback)

dir - an empty variable (to later store the directory path in), 

list - an array (a list of file paths, each HTML file to be concatenated into a single js file, to be served as templates.js). Templates will be accessible through window.APP.templates[ templateName ] to render whatever data you want.

callback - simply returns (err,done) where done is a boolean (will be true when templates.js is written to disk)


#walker

takes (directoryToRead, [options], callback) 

Options is optional, and should be an object. Currently only supports one option - { toJSON: true } - which will return your directory structure and paths to files as JSON.

Will soon add support for ignore lists.
