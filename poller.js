var mongoose = require('mongoose');
var logger = require('./lib/logger');
var amqp = require('amqplib/callback_api');
var repeat = require('repeat');
var pollerTask = require('./lib/tasks/PollerTask.js');

var uri = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/'
	+ (process.env.DB_NAME || 'dagobert');

logger.info('[', 'MongoDB', ']', 'Connecting to ' + uri);

mongoose.connect(uri, function (err) {
	if (err) {
		return logger.error(err);
	}
	logger.info('[', 'MongoDB', ']', 'Connected to ' + uri);


	amqp.connect('amqp://' + (process.env.RABBIT_HOST || 'localhost'), function(err, conn) {
		if (err) {
			return logger.error(err);
		}

  	conn.createChannel(function(err, ch) {
			if (err) {
				return logger.error(err);
			}

  		repeat(pollerTask({
  			conn: conn,
  			ch: ch
  		})).every(10, 's').start.now();
  	});
  });
});
