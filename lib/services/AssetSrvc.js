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
					asset.quotes = { uri: '/assets/' + asset.symbol + '_' + asset.currency + '/quotes' };
					return asset;
				}));
			});
	},

	getQuotesForAsset : function (options, from, to, done) {

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
					'quotes.datetime': {
						$gt: from,
						$lt: to
					}
				}
			},
			{
				$group : {
					_id: "$_id",
					quotes: { $addToSet : "$quotes" }
				}
			},
			{
				$project: {
					'_id': 0,
					'quotes': 1
				}
			},
			function (err, asset) {
				if (err) {
					return done(err, null);
				}

				if (!asset) {
					return done({ code: 404, message: 'Asset not found'}, null);
				}

				// Get first row
				if (asset.length < 1) {
					return done(null, []);
				}
				else {
					return done(null, asset[0].quotes);
				}


			});
	}
}
