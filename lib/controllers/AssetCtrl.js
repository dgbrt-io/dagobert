
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

	if (!req.params['symbol']) {
		return console.error(util.error('No symbol provided'));
	}

	var searchOptions = {
		symbol: req.params['symbol']
	};

	Asset.findOne(searchOptions, function (err, asset) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}

		if (!asset) {
			console.log('Asset not found')
			return res.status(404).send(util.error('Asset not found'));
		}

		asset = asset.toObject();


		var from = req.query.from;
		var to = req.query.to;

		asset.quotes = asset.quotes.filter(function (quote) {
			if (from && quote.datetime <= new Date(from)) return false;
			if (to && quote.datetime >= new Date(to)) return false;
			return true;
		});

		asset.quotes.sort(function (a, b) {
			if (a.datetime < b.datetime) return -1;
			else if (a.datetime > b.datetime) return 1;
			else if (a.datetime === b.datetime) return 0;
		}).map(function (quote, i) {

			quote.timeOffset = 0;

			if (i > 0) {
				quote.timeOffset = (quote.datetime.getTime() - asset.quotes[i - 1].datetime.getTime());
			}
			else if (from) {
				quote.timeOffset = (quote.datetime.getTime() - new Date(from).getTime());
			}

			return quote;
		});

		asset.calc = {};

		asset.calc.totalTimeOffset = asset.quotes.reduce(function (sum, quote) {
			return sum + quote.timeOffset;
		}, 0);


		var field = req.query.field;
		var allowedFields = ['bid', 'ask', 'last'];

		if (allowedFields.indexOf(field) < 0) {
			field = 'last';
		}

		// Calc time-weightened avg
		asset.calc.average = asset.quotes.map(function (quote) {
			return quote[field] * quote.timeOffset / asset.calc.totalTimeOffset;
		})
		.reduce(function(sum, num) {
			return sum + num;
		}, 0);

		// StdDev
		asset.calc.variance = asset.quotes.map(function (quote) {
			return quote.timeOffset * Math.pow(quote[field] - asset.calc.average, 2) / asset.calc.totalTimeOffset;
		})
		.reduce(function (sum, num) {
			return sum + num;
		}, 0);

		//asset.calc.pivots = pivots(asset.quotes);
		asset.calc.stdDev = Math.pow(asset.calc.variance, 1/2);
		asset.calc.from = from;
		asset.calc.to = to;

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
