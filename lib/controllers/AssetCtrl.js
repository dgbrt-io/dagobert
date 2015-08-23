
var util = require('../util');
var Asset = require('../models/Asset');
var _ = require('underscore');

module.exports.get = function (req, res) {
	Asset.find({})
		.select('-quotes')
		.exec(function (err, assets) {
			if (err) {
				console.error(err);
				return res.status(500).send(err);
			}
			res.send(assets);
		});
};

module.exports.getBySymbol = function (req, res) {

	Asset.findOne({ symbol: req.query.symbol }, function (err, asset) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}

		asset = asset.toObject();

		asset.quotes = asset.quotes.sort(function (a, b) {
			if (a.datetime > b.datetime) return -1;
			else if (a.datetime < b.datetime) return 1;
			else if (a.datetime === b.datetime) return 0;
		}).map(function (quote, i) {

			quote.timeOffset = 0;

			if (i < (asset.quotes.length - 1)) {
				quote.timeOffset = (quote.datetime.getTime() - asset.quotes[i + 1].datetime.getTime());
			}

			return quote;
		});

		asset.totalTimeOffset = asset.quotes.reduce(function (sum, quote) {
			console.log(quote.timeOffset);
			return sum + quote.timeOffset;
		}, 0);

		res.send(asset);
	});
};

module.exports.post = function (req, res) {
	var newAsset = {
		isin: req.body.isin,
		symbol: req.body.symbol,
		currency: req.body.currency,
		exchange: req.body.exchange,
		type: req.body.type,
		quotes: []
	};

	Asset.create(newAsset, function (err, asset) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.status(201).send(asset);
		console.log('Created new asset');
	});
};
