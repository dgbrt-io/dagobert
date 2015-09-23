var logger = require('./lib/logger');

require('./lib/mongodb')(function (err) {
	if (err) {
		return logger.error(err);
	}
	logger.info('[MongoDB]', 'Connected to database');

	require('./lib/rabbitmq')(function (err, conn) {
		if (err) {
			return logger.error(err);
		}
		logger.info('[RabbitMQ]', 'Connected to RabbitMQ');

		// Start web server
		var http = require('./lib/http');
		var serverInstance = http.listen(process.env.PORT || 8000, function () {
		  var host = serverInstance.address().address;
		  var port = serverInstance.address().port;

		  logger.info('App listening at http://%s:%s', host, port);
		});
	});
});

