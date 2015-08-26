
var Asset = require('../models/Asset');


function format (input) {
	if (input instanceof Array) {
		for (var i = 0; i < input.length; i++) {
			input[i] = format(input[i]);
		}
		return input;
	}
	else {
		var asset = input.toObject();

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

		return asset;
	}
}



module.exports = {

	all: function (options, done) {
	Asset.find(options, function (err, assets) {
			done(err, format(assets));
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

			asset = format(asset);

			done(null, asset);
		});
	}
}
