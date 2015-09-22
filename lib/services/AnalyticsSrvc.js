
var async = require('async');
var QuoteSrvc = require('../services/QuoteSrvc');
var logger = require('../logger');

var ONE_DAY = 1000 * 60 * 60 * 24;


module.exports.calc = function (params, done) {

	if (!params) {
		return done({ msg: 'No parameters provided', code: 400 });
	}

	if (!params.pair) {
		return done({ msg: 'No asset pair provided', code: 400 });
	}

	var to = new Date();
	var from = new Date(to.getTime() - ONE_DAY * 7);

	QuoteSrvc.all({ pair: params.pair }, from, to, function (err, quotes) {
		if (err) {
			return done(err, null);
		}

		return done(null, {
			pair: params.pair,
			from: from,
			to: to,
			quotes: quotes
		})
	});
};
