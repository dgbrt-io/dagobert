
var util = require('../util');
var logger = require('../logger');
var QuoteSrvc = require('../services/QuoteSrvc');
var _ = require('underscore');

/**
 * Get quotes of an asset specified
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.allQuotesForAssetPair = function (req, res) {
	console.log('asdsd');
	var pair = req.params['pair'];

	if (!pair) {
		return logger.error(util.error('No pair provided'));
	}

	req.query.pair = pair;

	var from = req.query.from;
	if (from) {
		from = new Date(from);
	}
	else {
		from = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
	}
	req.query.from = undefined;

	var to = req.query.to;
	if (to) {
		to = new Date(to);
	}
	else {
		to = new Date();
	}
	req.query.to = undefined;

	QuoteSrvc.all(req.query, from, to, function (err, quotes) {
			if (err) {
				logger.error(err);
				return res.status(500).send(err);
			}

			res.send(quotes);
		});
};
