
var async = require('async');
var QuoteSrvc = require('../services/QuoteSrvc');
var logger = require('../logger');

module.exports.calc = function (params, done) {

	if (!params) {
		return done({ msg: 'No parameters provided', code: 400 });
	}

	if (!params.pair) {
		return done({ msg: 'No asset pair provided', code: 400 });
	}

	if (!params.periods || params.periods.length === 0) {
		return done({ msg: 'No periods provided', code: 400 });
	}

	var to = new Date();

	var tasks = params.periods.map(function (offset) {
		var from = new Date(to.getTime() - offset);
		return function (done) {

			QuoteSrvc.all({ pair: params.pair }, from, to, function (err, quotes) {
				if (err) {
					return done(err, null);
				}

				done(null, {
					from: from,
					to: to,
					quotes: quotes
				})
			});
		}
	});

	async.parallel(tasks, function (err, periods) {
		if (err) {
			logger.error('error');
			return done(err, null);
		}

		return done(err, {
			pair: params.pair,
			periods: periods
		})
	});
};
