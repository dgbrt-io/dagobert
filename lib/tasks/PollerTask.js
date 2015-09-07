var logger = require('../logger');
var _ = require('underscore');
var async = require('async');
var AssetPair = require('../models/AssetPair');
var Quote = require('../models/Quote');

var Q = require('q');
var providers = require('fs').readdirSync('./lib/providers').map(function (provider) {
	return require('../providers/' + provider);
});

module.exports = function(rabbitmq) {
	var msgEx = 'quotes';

	// Create exchange
	rabbitmq.ch.assertExchange(msgEx, 'fanout', { durable: false });

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

								var msg = JSON.stringify(quote);
    						rabbitmq.ch.publish(msgEx, '', new Buffer(msg));
								logger.trace('[', 'PollerTask', ']', 'Quote for pair', quote.pair, 'added and published');
							});
					});
				});
			});
		});
	}
}
