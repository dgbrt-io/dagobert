var Asset = require('../models/Asset');
var AssetSrvc = require('../services/AssetSrvc');
var Yahoo = require('../services/YahooSrvc');
var _ = require('underscore');

var providers = require('../config').providers;

module.exports.pollMarkets = function (req, res) {
	res.status(202).send({ 'status': 'accepted'});

	(function () {

		_.each(providers, function (provider) {
			Asset.find({ provider: provider.name }, function (err, assets) {
				if (err) {
					return console.log(err);
				}

				provider.getQuotes(assets, function (err, quotes) {
					if (err) {
						return console.log(err);
					}

					_.each(quotes, function (quote) {
						Asset.findOneAndUpdate(quote.asset,
							{ $push : { quotes : quote.quote }},
							{ safe: true, upsert: true },
							function (err, asset) {
								if (err) {
									return console.log(err);
								}
								if (!asset) {
									return console.log('Asset with criteria', quote.asset, 'not found');
								}
								console.log('Asset', asset.symbol + '/' + asset.currency, 'updated');
							});
					});
				});
			});
		});

		// assets.forEach(function (asset) {
		// 	var provider = require('../providers/' + asset.provider);

		// 	provider.getQuote(asset, function (err, quote) {
		// 		if (err) {
		// 			return console.log(err);
		// 		}

		// 		if (!quote) {
		// 			return console.log('Invalid quote');
		// 		}

		// 		asset.quotes.push(quote);

		// 		asset.save(function (err, asset) {
		// 			if (err) {
		// 				return console.log(err);
		// 			}
		// 			console.log('Quote updated for asset ' + asset.symbol + '_' + asset.currency);
		// 		});
		// 	});
		// });
	})();
};
