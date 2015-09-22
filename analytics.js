// var mongoose = require('mongoose');
//

var mongoose = require('mongoose');
var amqp = require('amqplib/callback_api');
var logger = require('./lib/logger');
var AnalyticsSrvc = require('./lib/services/AnalyticsSrvc');

var uri = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/'
	+ (process.env.DB_NAME || 'dagobert');

mongoose.connect(uri, function (err) {
	if (err) {
		return logger.error(err);
	}

  logger.info('Connected to ', uri);

  var amqUri = 'amqp://' + (process.env.RABBIT_HOST || 'localhost');

  amqp.connect(amqUri, function(err, conn) {
    if (err) {
      return logger.error(err);
    }


    logger.info('Connected to', amqUri);

    conn.createChannel(function(err, ch) {
      var q = 'tasks_queue';
      var ex = 'quotes';

      ch.assertQueue(q, {durable: true});
      ch.prefetch(1);

      ch.assertExchange(ex, 'fanout', {durable: false});

      ch.consume(q, function(msg) {

        var params = JSON.parse(msg.content.toString());
        ch.ack(msg);

        logger.trace('Received task for pair ', params.pair);

        AnalyticsSrvc.calc(params, function (err, res) {
          if (err) {
            return logger.error(err);
          }

          ch.publish(ex, '', new Buffer(JSON.stringify(res)));
          logger.trace('Sent result');
        });


      }, {noAck: false});
    });
  });
});
