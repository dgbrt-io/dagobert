var _ = require('underscore');
var Asset = require('../models/Asset');


module.exports = {

	all: function (options, done) {
		Asset.find(options)
			.select('-_id -quotes')
			.exec(function (err, assets) {

				if (err) {
					return done(err, null);
				}

				return done(null, _.map(assets, function (asset) {
					asset = asset.toObject();
					asset.quotes = { uri: '/assets/' + asset.symbol + '_' + asset.currency };
					return asset;
				}));
			});
	},

	findOne : function (options, from, to, done) {
		console.log('AssetSrvc.findOne(...)');


		Asset
			.aggregate({
				$match : {
					symbol: options.symbol,
					currency: options.currency
				}
			},
			{
				$unwind: '$quotes'
			},
			{
				$match: {
					quotes: { $gte: from, $lte: to }
				}
			},
			{
				$group : {
					_id: "$_id",
					quotes: { $addToSet : "$quotes" }
				}
			})
			.exec(function (err, asset) {
				if (err) {
					return done(err, null);
				}

				if (!asset) {
					return done({ code: 404, message: 'Asset not found'}, null);
				}

				done(null, asset);

			});

		// Asset.findOne(options, function (err, asset) {
		// 	if (err) {
		// 		return done(err, null);
		// 	}

		// 	if (!asset) {
		// 		return done({ code: 404, message: 'Asset not found'}, null);
		// 	}

		// 	console.log('Found asset ' + asset.symbol + '/' + asset.currency + ' with ' + asset.quotes.length + ' quotes');

		// 	asset = asset.toObject();

		// 	asset.quotes = asset.quotes.filter(function (quote) {
		// 		return quote.datetime >= from && quote.datetime <= to;
		// 	})

		// 	done(null, asset);
		// });
	}
}
