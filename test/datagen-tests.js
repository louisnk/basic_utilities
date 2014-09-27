var dg = require('../lib/datagen');
var os = require('os');

describe('Random system time-series data generation', function() {
	var now = new Date();
			period = 'week';

	it('generates a nice array for time series', function() {
		var i = 0;

		is(typeof dg.times([], i, period), 'number');
		is(dg.times([], i, period) < new Date().getTime(), true);
	});

	it('creates plausible cpu usage numbers', function() {
		is(typeof dg.cpu(), 'number');
		is(dg.cpu() > 1 && dg.cpu() < 100, true);
	});

	it('comes up with data for every core', function() {
		is(Array.isArray(dg.cores()), true);
		is(dg.cores().length, os.cpus().length);
	});

	it('generates RAM numbers', function() {
		is(typeof dg.ram(), 'number');
		is(dg.ram() > 0 && dg.ram() < 100, true);
	});

	it('gets creative with disk usage and i/o', function() {
		var data = [ 30 ],
				i = 1;

		is(typeof dg.disk(data,i), 'number');
		is(dg.disk(data, i) > 30, true);
	});	

	it('does maths to come up with eth0 datas', function() {
		is(typeof dg.eth(), 'number');
		is(dg.eth() > 0 && dg.eth() < 100, true);
	});

	it('mathematically calculates some random wifi throughputs', function() {
		is(typeof dg.wifi(), 'number');
		is(dg.wifi() > 0 && dg.wifi() < 90, true);
	});

	// it('generates all the data you want, for however many datapoints', function() {
	// 	is(typeof dg.all('hour'), 'object');
	// 	is(dg.all('hour').cpu.length, 12);
	// 	is(dg.all('hour').times[0] < now, true);
	// 	is(dg.all('hour').times[12] - new Date().getTime() < 1000, true);
	// })
})