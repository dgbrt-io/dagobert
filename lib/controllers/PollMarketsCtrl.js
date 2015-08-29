var Asset = require('../models/Asset');
var AssetSrvc = require('../services/AssetSrvc');
var Yahoo = require('../services/YahooSrvc');
var async = require('async');
var _ = require('underscore');

var providers = require('../config').providers;

module.exports.pollMarkets = function (req, res) {
	res.status(202).send({ 'status': 'accepted'});

	async.each(providers, function (provider, done) {
		Asset.find({ provider: provider.name }, function (err, assets) {
			if (err) {
				console.log('Error finding assets by provider name');
				return console.log(err);
			}

			provider.getQuotes(assets, function (err, quotes) {
				if (err) {
					console.log('Error getting quotes from provider ' + provider.name);
					return console.log(err);
				}

				async.each(quotes, function (quote, done) {
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
							done();
						});
				});
				done();
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
};
