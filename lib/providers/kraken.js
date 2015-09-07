var KrakenClient = require('kraken-api');
var logger = require('../logger');
var _ = require('underscore');

if (!process.env.KRAKEN_API_KEY) {
	throw Error('KRAKEN_API_KEY not set');
}
if (!process.env.KRAKEN_PRIVATE_KEY) {
	throw Error('KRAKEN_PRIVATE_KEY not set');
}
var kraken = new KrakenClient(process.env.KRAKEN_API_KEY, process.env.KRAKEN_PRIVATE_KEY);

module.exports = {
	name : 'kraken',
	getQuotes: function (assets, done) {

		process.nextTick(function () {

			var splitChar = '_';
			var options = { "pair": _.map(assets, function (asset) {
				var symbol = asset.pair.split(splitChar)[0];
				var currency = asset.pair.split(splitChar)[1];
				return  symbol + currency;
			}).join(',') };

			logger.trace('[', 'kraken', ']', 'Querying asset pairs', options.pair);

			kraken.api('Ticker', options, function(error, data) {

				if (error) {
					return done(error, null);
				}

				if (!data) {
					return done('Invalid data', null);
				}

				if (!data.result) {
					return done('Invalid data', null);
				}

				var quotes = data.result;
				done(null, _.map(Object.keys(quotes), function (pair) {
					var quote = quotes[pair];

					return {
						datetime: new Date(),
						bid: quote.b[0],
						ask: quote.a[0],
						last: quote.c[0],
						pair: asset.pair
					};
				}));
			});
		});
	}
}
