var logger = require('../logger');
var _ = require('underscore');
var async = require('async');
var Asset = require('../models/Asset');

var Q = require('q');
var providers = require('fs').readdirSync('./lib/providers').map(function (provider) {
	return require('../providers/' + provider);
});

module.exports = function() {
	async.eachLimit(providers, 5, function (provider, done) {

		Asset.find({ provider: provider.name }, function (err, assets) {
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
					Asset.findOneAndUpdate(quote.asset,
						{ $push : { quotes : quote.quote }},
						{ safe: true, upsert: true },
						function (err, asset) {
							if (err) {
								return logger.error(err);
							}
							if (!asset) {
								return logger.error('[', 'PollerTask', ']', 'Asset with criteria', quote.asset, 'not found');
							}
							logger.trace('[', 'PollerTask', ']', 'Asset', asset.symbol + '/' + asset.currency, 'updated');
							//io.emit('quote', quote);
						});
				});
			});
		});
	});
}
