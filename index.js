var app = require('./lib/app');
var mongoose = require('mongoose');
var logger = require('./lib/logger');

var uri = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/'
	+ (process.env.DB_NAME || 'dagobert_mdw');
logger.info('Connecting to ' + uri);
mongoose.connect(uri, function (err) {
	if (err) {
		return logger.error(err);
	}
	logger.info('Connected to ' + uri);

	var server = app.listen(process.env.PORT || 8000, function () {
	  var host = server.address().address;
	  var port = server.address().port;

	  logger.info('App listening at http://%s:%s', host, port);
	  require('repeat')(require('./lib/tasks/PollerTask.js')).every(1, 'm').start.now();
	});
});
