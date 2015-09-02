var logger = require('../logger');
var _ = require('underscore');
var Asset = require('../models/Asset');
var providers = require('fs').readdirSync('./lib/providers').map(function (provider) {
	return require('../providers/' + provider);
});

module.exports = function() {
	_.each(providers, function (provider, done) {
		Asset.find({ provider: provider.name }, function (err, assets) {
			if (err) {
				logger.error('Error finding assets by provider name');
				return logger.error(err);
			}

			provider.getQuotes(assets, function (err, quotes) {
				if (err) {
					logger.error('Error getting quotes from provider ' + provider.name);
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
								return logger.error('Asset with criteria', quote.asset, 'not found');
							}
							logger.debug('Asset', asset.symbol + '/' + asset.currency, 'updated');
						});
				});
			});
		});
	});
}
