var mongoose = require('mongoose');
var logger = require('./lib/logger');
var server = require('./lib/server');

var uri = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/'
	+ (process.env.DB_NAME || 'dagobert');
logger.info('Connecting to ' + uri);
mongoose.connect(uri, function (err) {
	if (err) {
		return logger.error(err);
	}

	logger.info('Connected to ' + uri);

	var serverInstance = server.http.listen(process.env.PORT || 8000, function () {
	  var host = serverInstance.address().address;
	  var port = serverInstance.address().port;

	  logger.info('App listening at http://%s:%s', host, port);
	});
});
