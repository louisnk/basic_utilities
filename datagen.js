/*
 *  Mostly creates random system usage data, but
 *  uses the actual number of cores for your CPU
 *  and actual memory usage data;
 *
 */
var os = require('os');
var _ = require('lodash');

var dataGen = module.exports = {
  numCores: os.cpus().length,

  all: function(period) {
    var dataObject = {
          cpu   : new Array(),
          // cores : new Array(),
          ram   : new Array(),
          disk  : new Array(),
          eth   : new Array(),
          wifi  : new Array(),
          times : new Array()
        },
        points = period === 'week' ? 21 : 12;
        self = this;

    for (var i = 0; i < points; i++) {

      _.each(dataObject, function(data, set) {
        if (set === 'disk' || set === 'times') {
          dataObject[set] = data.concat(this[set](data, i, period))
        } else { dataObject[set] = data.concat(this[set](i)); }
        
      }.bind(this));
    }

    return dataObject;
  },

  cpu: function() {
    return Math.ceil(Math.random() * 100);
  },

  cores: function() {
    var coreData = [],
        cores = this.numCores; 

    for (var i = 0; i < cores; i++) {
      coreData.push(this.cpu());
    }

    if (cores > 8) {
      coreData = chunkAndAverageClusters(coreData, cores / 4);
    }

    return coreData;
  },

  ram: function()  {
    
    return Math.ceil((os.totalmem() / 
                     (os.totalmem() - os.freemem())) * 10) + 
                     Math.ceil(Math.random() * 20);
  },

  disk: function(data, i) {
    if (i === 0) {
      return Math.ceil(Math.random() * 20);
    } else {
      return data[i - 1] + Math.ceil(Math.random() * 2);
    }
  }, 

  eth: function(i) {
    if (i % 2 === 0) { return Math.ceil(Math.random() * 66); }
    else { return Math.ceil(Math.random() * 100); }
  },

  wifi: function(i) {
    if (i % 2 !== 0) { return Math.ceil(Math.random() * 50); }
    else { return Math.ceil(Math.random() * 90); }
  },

  times: function(data, i, period) {
    // subtracts the right amount of time so it counts up to now, then sets
    // the amount of time it needs to increment

    var ago = (period === 'week') ? (86400 * 1000 * 7) : (60 * 60 * 1000),
        increment = (period === 'week') ? (8 * 60 * 60 * 1000) : (60 * 1000 * 5);

    if (i === 0) { return new Date().getTime() - ago; }
    else { return data[i - 1] + increment; }
  },

  chunkAndAverageClusters: function(list, size) {
    var chunks = [],
        current = 0;

    for (var i = 0; i < list.length; i++) {
      if (i < size) {
        current += list[i];
      } else if (i === size) {
        chunks.push(current / size);
        current = 0;
      }
    }

    return chunks;
  }

}