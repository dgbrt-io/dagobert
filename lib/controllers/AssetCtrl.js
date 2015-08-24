
var util = require('../util');
var Asset = require('../models/Asset');
var _ = require('underscore');


function isValidDate(d) {
	if ( Object.prototype.toString.call(d) === "[object Date]" ) {
	  if ( isNaN( d.getTime() ) ) {
	    return false;
	  }
	  else {
			return true;
	  }
	}
	else {
		return false;
	}
}

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
			if (a.datetime > b.datetime) return -1;
			else if (a.datetime < b.datetime) return 1;
			else if (a.datetime === b.datetime) return 0;
		}).map(function (quote, i) {

			quote.timeOffset = 0;

			if (i < (asset.quotes.length - 1)) {
				quote.timeOffset = (quote.datetime.getTime() - asset.quotes[i + 1].datetime.getTime());
			}
			else if (from) {
				quote.timeOffset = (quote.datetime.getTime() - new Date(from).getTime());
			}

			return quote;
		});

		asset.totalTimeOffset = asset.quotes.reduce(function (sum, quote) {
			return sum + quote.timeOffset;
		}, 0);

		// Calc time-weightened avg
		asset.twa = asset.quotes.map(function (quote) {
			return quote.last * quote.timeOffset / asset.totalTimeOffset;
		})
		.reduce(function(sum, num) {
			return sum + num;
		}, 0);

		// StdDev
		asset.variance = asset.quotes.map(function (quote) {
			return quote.timeOffset * Math.pow(quote.last - asset.twa, 2) / asset.totalTimeOffset;
		})
		.reduce(function (sum, num) {
			return sum + num;
		}, 0);
		asset.stdDev = Math.pow(asset.variance, 1/2);

		asset.from = from;
		asset.to = to;

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
