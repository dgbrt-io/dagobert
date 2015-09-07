
var util = require('../util');
var logger = require('../logger');
var AssetPair = require('../models/AssetPair');
var AssetPairSrvc = require('../services/AssetPairSrvc');
var _ = require('underscore');

/**
 * Get all assets
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.all = function (req, res) {
	AssetPairSrvc.all(req.query, function (err, assets) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(assets);
	});
};

module.exports.get = function (req, res) {
	var pair = req.params['pair'];

	if (!pair) {
		return res.status(400).send('Invalid asset pair provided');
	}
	AssetPair.findOne({ pair : pair}, function (err, asset) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}

		if (!asset) {
			return res.status(404).send('Not found');
		}
		res.status(200).send(asset);
	});

};


module.exports.add = function (req, res) {
	var newAsset = req.body;

	AssetPair.create({
		pair: req.body.pair,
		provider: req.body.provider,
		isin: req.body.isin
	}, function (err, asset) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}
		res.status(201).send(asset);

	});
};

module.exports.remove = function (req, res) {
	var pair = req.params['pair'];

	if (!pair) {
		return res.status(400).send('Invalid asset pair provided');
	}

	AssetPair.remove({
		pair: pair
	}, function (err, asset) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(asset);

	});
};
