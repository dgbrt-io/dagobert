var Asset = require('../models/Asset');

module.exports.get = function (req, res) {
	Asset.find({}, function (err, assets) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.send(assets);
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
