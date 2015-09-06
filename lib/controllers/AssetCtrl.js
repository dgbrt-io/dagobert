
var util = require('../util');
var logger = require('../logger');
var Asset = require('../models/Asset');
var AssetSrvc = require('../services/AssetSrvc');
var _ = require('underscore');

/**
 * Get all assets
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.all = function (req, res) {
	AssetSrvc.all(req.query, function (err, assets) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(assets);
		logger.debug('Sent all assets');
	});
};

/**
 * Get quotes of an asset specified
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.getQuotesForAsset = function (req, res) {

	if (!req.params['pair']) {
		return logger.error(util.error('No pair provided'));
	}

	var symbol = req.params['pair'].split('_')[0];
	var currency = req.params['pair'].split('_')[1];

	var from = req.query.from;
	if (from) {
		from = new Date(from);
	}
	else {
		from = new Date(new Date().getTime() - 60 * 60 * 1000);
	}
	var to = req.query.to;
	if (to) {
		to = new Date(to);
	}
	else {
		to = new Date();
	}
	var field = req.query.field;
	var allowedFields = ['bid', 'ask', 'last'];
	if (allowedFields.indexOf(field) < 0) {
		field = 'last';
	}
	AssetSrvc.getQuotesForAsset({
			symbol: symbol,
			currency: currency
		},from, to, function (err, quotes) {
			if (err) {
				logger.error(err);
				return res.status(500).send(err);
			}
			if (!quotes) {
				logger.error('getQuotesForAsset(...) Quotes array received from db was null');
				return res.status(500).send(util.error(500, 'Error getting quotes'));
			}

			var asset = {};

			// Sort descending
			asset.quotes = quotes.sort(function (left, right) {
				if (left.datetime < right.datetime) return -1;
				if (left.datetime > right.datetime) return 1;
				return 0;
			});

			//Create time offsets
			asset.quotes = _.map(asset.quotes, function (quote, i) {
				quote.timeOffset = 0;
				if (i > 0) {
					quote.timeOffset = (quote.datetime.getTime() - asset.quotes[i - 1].datetime.getTime());
				}
				else if (from) {
					quote.timeOffset = (quote.datetime.getTime() - new Date(from).getTime());
				}
				return quote;
			});

			asset.from = from;
			asset.to = to;
			asset.avg = util.avg(asset.quotes, field, {
				weight : 'timeOffset'
			});
			asset.stdDev = util.stdDev(asset.quotes, field, {
				weight: 'timeOffset'
			});


			res.send(asset);

		});
};


module.exports.addAsset = function (req, res) {
	var newAsset = req.body;
	newAsset.quotes = [];

	Asset.create(newAsset, function (err, asset) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}
		res.status(201).send(asset);

	});
};

module.exports.addQuote = function (req, res) {
	res.send('Ok');
};
