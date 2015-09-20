var logger = require('../logger');
var _ = require('underscore');
var async = require('async');
var AssetPair = require('../models/AssetPair');
var Quote = require('../models/Quote');

var oneMinute = 1000 * 60;
var fibanocci = [1, 2, 3, 5, 8, 13, 21];
var periods = fibanocci.map(function (item) {
	return oneMinute * item;
});

var Q = require('q');
var providers = require('fs').readdirSync('./lib/providers').map(function (provider) {
	return require('../providers/' + provider);
});

module.exports = function(rabbitmq) {
	var queueName = 'tasks_queue';

	rabbitmq.ch.assertQueue(queueName, { durable: true });

	// Create exchange
	//rabbitmq.ch.assertExchange(msgEx, 'fanout', { durable: false });

	return function () {
		async.eachLimit(providers, 5, function (provider, done) {

			AssetPair.find({ provider: provider.name }, function (err, assets) {
				if (err) {
					return logger.error(err);
				}

				if (!assets || assets.length === 0) {
					return logger.warn('[', 'PollerTask', ']', '[', provider.name, ']', 'No assets found for this provider. Skipping...');
				}

				logger.trace('[', 'PollerTask', ']', '[', provider.name, ']', 'Updating quotes for', assets.length, 'assets');

				provider.getQuotes(assets, function (err, quotes) {
					if (err) {
						logger.error('[', 'PollerTask', ']', 'Error getting quotes from provider ' + provider.name);
						return logger.error(err);
					}

					_.each(quotes, function (quote, done) {
						Quote.create(quote,
							function (err, quote) {
								if (err) {
									return logger.error(err);
								}

								// Create task
								var msg = JSON.stringify({
									periods: periods,
									pair: quote.pair
								});
								rabbitmq.ch.sendToQueue(queueName, new Buffer(msg), { persistent: true });
								logger.trace('[', 'PollerTask', ']', 'Added task for', quote.pair);
							});
					});
				});
			});
		});
	}
}
