var _ = require('underscore');
var Quote = require('../models/Quote');


module.exports.all = function (options, from, to, done) {

	if (!options) {
		options = {};
	}

	options.datetime = {
		$lte: to,
		$gte: from
	};

	Quote.find(options,
		function (err, quotes) {
			if (err) {
				return done(err, null);
			}
			return done(null, quotes);
		});
}
