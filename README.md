#Toolbox

Just random JS utilities I've made, all Node.js for now.


##hogan_compiler - Node.js

Takes a bunch of HTML template files written in Hogan (basically mustache) and concatenates them all into a single JS file which gets written to disk in the views folder, to be served as your compiled templates and rendered on the front end (or server-side, if you please).

Parameters: (dir, list, callback)

dir - an empty variable (to later store the directory path in), 

list - an array (a list of file paths, each HTML file to be concatenated into a single js file, to be served as templates.js). Templates will be accessible through window.APP.templates[ templateName ] to render whatever data you want.

callback - simply returns (err,done) where done is a boolean (will be true when templates.js is written to disk)


##walker - Node.js

takes (directoryToRead, [options], callback) 

Options is optional, and should be an object. Currently only supports one option - { toJSON: true } - which will return your directory structure and paths to files as JSON.

Can also pass in a CSV, or array, of files or extensions to ignore, and it will be done.

use {ignore: [arrayOfThingsToIgnore]} or {ignore: 'foo,bar,baz'}


##Datagen - Node.js

Currently will generate random system data for a given period, either 1 hour or 1 week (options passed in)

`var datagen = require('path/to/datagen');`

`var data = datagen.all('week')`

`datagen.all('week')` will return an object with each property an array of data for the given part of the system.

In this case, data would look like: `{ cpu: [1,2,3], disk: [3,4,5], ram: [6,7,8] }` etc.

You can also access each dataset function individually - `var cpu = datagen.cpu()` will return a single random Math value.

That's it. Returns arays for CPU, Disk, RAM, Eth0, Wifi, and Times. It can also generate separate data for each core of your CPU, as well as Disk i/o and usage.

The `times` array is in milliseconds since 1970, format it with `new Date(times[i])` or moment.js or whatever.

