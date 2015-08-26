
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

		// // Show only rates between those dates
		// asset.quotes = asset.quotes.filter(function (quote) {
		// 	if (from && quote.datetime <= new Date(from)) return false;
		// 	if (to && quote.datetime >= new Date(to)) return false;
		// 	return true;
		// });

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

	all: function (options, from, to, done) {
		console.log(from, to);

		Asset.aggregate([
			// you can remove this to return all your data
			{$match : options},
			// unwind array of items
			{$unwind : "$quotes"},
			// filter out all items not in 10, 11
			{$match : {"quotes.datetime" : { $gte : from, $lte: to } } },
			// aggregate again into array
			{$group : { _id : "$_id", "quotes" : { $push:"$quotes"} } }
			], function (err, assets) {
				done(err, assets);
			});
		// Asset.find(options)
		// 	.select({
		// 		_id: 1,
		// 		symbol: 1,
		// 		currency: 1,
		// 		provider: 1,
		// 		exchange: 1,
		// 		isin: 1,
		// 		type: 1,
		// 		quotes: { $elemMatch : { datetime: { $gte : from, $lte: to } } }
		// 	})
		// 	.exec(function (err, assets) {
		// 		done(err, format(assets));
		// 	});
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
