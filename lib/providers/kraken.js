var KrakenClient = require('kraken-api');
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

		var options = { "pair": _.map(assets, function (asset) {
			return asset.symbol + asset.currency;
		}).join(',') };

		kraken.api('Ticker', options, function(error, data) {
			if(error) {
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
				var symbol = pair.substring(0, 4);
				var currency = pair.substring(4, 8);
				var quote = quotes[pair];

				return {
					asset: {
						symbol: symbol,
						currency: currency
					},
					quote: {
						datetime: new Date(),
						bid: quote.b[0],
						ask: quote.a[0],
						last: quote.c[0],
					}
				};
			}));
		});
	}
}
