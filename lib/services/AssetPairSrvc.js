var _ = require('underscore');
var AssetPair = require('../models/AssetPair');


module.exports = {

	all: function (options, done) {
		AssetPair.find(options, function (err, assets) {

				if (err) {
					return done(err, null);
				}

				return done(null, _.map(assets, function (asset) {
					asset = asset.toObject();
					asset.quotes = { uri: '/assets/' + asset.pair + '/quotes' };
					return asset;
				}));
			});
	}
}
