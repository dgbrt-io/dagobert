var Asset = require('../models/Asset');
var AssetSrvc = require('../services/AssetSrvc');
var Yahoo = require('../services/YahooSrvc');
var _ = require('underscore');

var providers = require('../config').providers;

module.exports.pollMarkets = function (req, res) {
	res.status(202).send();

	(function () {

		_.each(providers, function (provider) {
			Asset.find({ provider: provider.name }, function (err, assets) {
				if (err) {
					return console.error(err);
				}
			});
		});

		// assets.forEach(function (asset) {
		// 	var provider = require('../providers/' + asset.provider);

		// 	provider.getQuote(asset, function (err, quote) {
		// 		if (err) {
		// 			return console.error(err);
		// 		}

		// 		if (!quote) {
		// 			return console.error('Invalid quote');
		// 		}

		// 		asset.quotes.push(quote);

		// 		asset.save(function (err, asset) {
		// 			if (err) {
		// 				return console.error(err);
		// 			}
		// 			console.log('Quote updated for asset ' + asset.symbol + '_' + asset.currency);
		// 		});
		// 	});
		// });
	})();
};
