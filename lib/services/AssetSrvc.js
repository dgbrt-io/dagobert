
var Asset = require('../models/Asset');

module.exports = {

	all: function (done) {
	Asset.find({})
		.exec(function (err, assets) {
			done(err, assets);
		});
	},

	allWithoutQuotes: function (done) {
	Asset.find({})
		.select('-quotes')
		.exec(function (err, assets) {
			done(err, assets);
		});
	},

	findOne : function (options, quoteoptions, done) {

		var from = quoteoptions.from;
		var to = quoteoptions.to;

		Asset.findOne(options, function (err, asset) {
			if (err) {
				console.error(err);
				return done(err, null);
			}

			if (!asset) {
				console.log('Asset not found')
				return done({ code: 404, message: 'Asset not found'}, null);
			}

			asset = asset.toObject();

			// Show only rates between those dates
			asset.quotes = asset.quotes.filter(function (quote) {
				if (from && quote.datetime <= new Date(from)) return false;
				if (to && quote.datetime >= new Date(to)) return false;
				return true;
			});

			// Sort asc
			asset.quotes = asset.quotes.sort(function (a, b) {
				if (a.datetime < b.datetime) return -1;
				else if (a.datetime > b.datetime) return 1;
				else if (a.datetime === b.datetime) return 0;
			});

			done(null, asset);
		});
	}
}
