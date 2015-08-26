
var util = require('../util');

var Asset = require('../models/Asset');
var AssetSrvc = require('../services/AssetSrvc');
var _ = require('underscore');

module.exports.all = function (req, res) {
	AssetSrvc.allWithoutQuotes(function (err, assets) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(assets);
		console.log('Sent all assets');
	});
};

module.exports.getBySymbol = function (req, res) {

	if (!req.params['symbol']) {
		return console.error(util.error('No symbol provided'));
	}

	var from = req.query.from;
	var to = req.query.to;
	var field = req.query.field;
	var allowedFields = ['bid', 'ask', 'last'];
	if (allowedFields.indexOf(field) < 0) {
		field = 'last';
	}

	AssetSrvc.findOne({
			symbol: req.params.symbol
		},{
			from: from,
			to: to
		}, function (err, asset) {
			if (err) {
				console.error(err);
				return res.status(500).send(err);
			}
			if (!asset) {
				return res.status(404).send(util.error(404, 'Asset not found'));
			}

			// Create time offsets
			asset.quotes = asset.quotes.map(function (quote, i) {
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
			asset.calc.from = from;
			asset.calc.to = to;
			asset.calc.avg = util.avg(asset.quotes, field, {
				weight : 'timeOffset'
			});
			asset.calc.stdDev = util.stdDev(asset.quotes, field, {
				weight: 'timeOffset'
			});


			res.send(asset);
			console.log('Sent asset by symbol');

		});
};

module.exports.post = function (req, res) {
	var newAsset = req.body;
	newAsset.quotes = [];

	Asset.create(newAsset, function (err, asset) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.status(201).send(asset);

	});
};
