var amqp = require('amqplib/callback_api');
var io = require('./io');
var logger = require('./logger');

module.exports = function (done) {
	// Connect to RabbitMQ
	var rabbitMQUri = 'amqp://' + (process.env.RABBIT_HOST || 'localhost');
	amqp.connect(rabbitMQUri, function (err, conn) {

		if (err) {
			return done(err);
		}

		// Create channel
		conn.createChannel(function(err, ch) {
			if (err) {
				return done(err);
			}

			logger.info('[RabbitMQ]', 'Channel created');

			// Create exchange and queue for quotes
			var ex = 'quotes';
			ch.assertExchange(ex, 'fanout', { durable: false });
			ch.assertQueue('', { exclusive: true }, function(err, q) {
				logger.trace('[RabbitMQ]', 'Waiting for messages in', q.queue);
				ch.bindQueue(q.queue, ex, '');
				ch.consume(q.queue, function (msg) {
					var msg = JSON.parse(msg.content.toString());

					logger.trace('[RabbitMQ]', 'Message received');

					io.sockets.emit(msg.pair, msg);
					logger.trace('[Socket.io]', 'Message sent to socket on topic', msg.pair);
				}, { noAck: true });

				done(err, conn);
			});
		});
	});
}
