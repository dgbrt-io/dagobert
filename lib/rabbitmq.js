var amqp = require('amqplib/callback_api');
var io = require('./io');
var logger = require('./logger');
var config = require('../config');
var Job = require('./models/Job');
var tutum = require('./connectors/tutum');
var rest = require('restler');

var connection = null;
var quotesChannel = null;
var tasksChannel = null;

module.exports.getQuotesChannel = function () {
	return quotesChannel;
}

module.exports.getTasksChannel = function () {
	return tasksChannel;
}

module.exports.getConnection = function () {
	return connection;
}

module.exports.init = function (done) {

	// Connect to RabbitMQ
	var rabbitMQUri = 'amqp://' + (process.env.RABBIT_HOST || 'localhost');
	amqp.connect(rabbitMQUri, function (err, conn) {
		connection = conn;

		if (err) {
			return done(err);
		}

		// Create channel
		conn.createChannel(function(err, ch) {
			if (err) {
				return done(err);
			}
			quotesChannel = ch;

			logger.info('[RabbitMQ]', 'Quotes channel created');

			// Create exchange and queue for quotes
			var ex = 'quotes';
			quotesChannel.assertExchange(ex, 'fanout', { durable: false });
			quotesChannel.assertQueue('', { exclusive: true }, function(err, q) {
				logger.trace('[RabbitMQ]', 'Waiting for messages in', q.queue);
				quotesChannel.bindQueue(q.queue, ex, '');
				quotesChannel.consume(q.queue, function (msg) {
					var msg = JSON.parse(msg.content.toString());

					logger.trace('[RabbitMQ]', 'Message received');

					io.sockets.emit(msg.pair, msg);
					logger.trace('[Socket.io]', 'Message sent to socket on topic', msg.pair);
				}, { noAck: true });
			});
		});

		conn.createChannel(function (err, ch) {
			if (err) {
				return done(err);
			}
			tasksChannel = ch;

			logger.info('[RabbitMQ]', 'Tasks channel created');
			tasksChannel.assertQueue(config.rabbitmq.taskQueueName, { durable: true });

			// Only one message at a time
			tasksChannel.prefetch(1);

			tasksChannel.consume(config.rabbitmq.taskQueueName, function(msg) {
				logger.trace('Task received');

				var job = JSON.parse(msg.content.toString());


				Job.update({ _id: job._id }, { status: 'booting' }, function (err) {

					if (err) {
						tasksChannel.ack(msg);
						return logger.error(err);
					}

					var path = config.github.baseUrl + '/repositories/' + job.repoId
					console.log(path);
					rest.get(path).on('complete', function(repo, response) {

						tutum.post('/service/', {
							image: process.env.WORKER_DOCKER_IMAGE,
							entrypoint: 'bash -c "curl https://raw.githubusercontent.com/dgbrt-io/dagobert/master/worker/worker.sh | bash"',
							container_envvars: [{ key: "REPO", value: repo.full_name }]
						}, function (err, service) {
							if (err) {
								tasksChannel.ack(msg);
								return logger.error(err);
							}
							logger.trace('[Tutum]', 'Service created.');

							if (!service.uuid) {
								tasksChannel.ack(msg);
								return logger.error('Tutum returned invalid uuid for service');
							}

							tutum.post('/service/' + service.uuid + '/start/', function (err, service) {
								if (err) {
									tasksChannel.ack(msg);
									return logger.error(err);
								}

								logger.trace('Waiting 10000...');
								setTimeout(function () {
									Job.update({ _id: job._id }, { status: 'running', service: { uuid : service.uuid } }, function (err) {

										if (err) {
											tasksChannel.ack(msg);
											return logger.error(err);
										}

										tutum.stream('/service/' + service.uuid + '/logs/', function (err, conn) {
											if (err) {
												tasksChannel.ack(msg);
												return logger.error(err);
											}

											conn.on('error', function(err) {
												logger.error(err);
												Job.update({ _id: job._id }, { status: 'error', $push: { logs : JSON.stringify(err) } }, function (err, job) {
													if (err) {
														tasksChannel.ack(msg);
														return logger.error(err);
													}
													tasksChannel.ack(msg);
												});
											});

											conn.on('close', function() {
												logger.debug('Connection closed');
												Job.update({ _id: job._id }, { status: 'finished' }, function (err) {
													if (err) {
														tasksChannel.ack(msg);
														return logger.error(err);
													}
													tasksChannel.ack(msg);
												});
											});

											conn.on('message', function(rawMessage) {
												logger.debug('Received message', rawMessage);

												if (rawMessage.type === 'utf8') {
													Job.update({ _id: job._id }, { $push: { logs : JSON.parse(rawMessage.utf8Data) }}, function (err) {
														if (err) {
															return logger.error(err);
														}

														Job.findOne({ _id: job._id }, function (err, job) {
															if (err) {
																return logger.error(err);
															}
															var topic = 'job_' + job._id;
															io.sockets.emit(topic, job);

															logger.debug('Emmitted', topic);
														});
													});
												}
											});
										});
									});
								}, 10000);
							});

						});

					});

				});
			}, { noAck: false });

			return done(err, conn);
		});
	});
}
