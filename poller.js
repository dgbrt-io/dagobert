var app = require('./lib/app');
var mongoose = require('mongoose');
var logger = require('./lib/logger');
var engine = require('engine.io');

var uri = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/'
	+ (process.env.DB_NAME || 'dagobert');

logger.info('[', 'MongoDB', ']', 'Connecting to ' + uri);

mongoose.connect(uri, function (err) {
	if (err) {
		return logger.error(err);
	}
	logger.info('[', 'MongoDB', ']', 'Connected to ' + uri);
	require('repeat')(require('./lib/tasks/PollerTask.js')).every(10, 's').start.now();

});
