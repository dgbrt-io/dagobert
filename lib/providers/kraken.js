var KrakenClient = require('kraken-api');

if (!process.env.KRAKEN_API_KEY) {
	throw Error('KRAKEN_API_KEY not set');
}
if (!process.env.KRAKEN_PRIVATE_KEY) {
	throw Error('KRAKEN_PRIVATE_KEY not set');
}
var kraken = new KrakenClient(process.env.KRAKEN_API_KEY, process.env.KRAKEN_PRIVATE_KEY);

module.exports = {
	getQuote: function (asset, done) {

		var pair = asset.symbol +  asset.currency;

		kraken.api('Ticker', {"pair": pair}, function(error, data) {
			if(error) {
				return done(error);
			}

			if (!data.result) {
				return done('Invalid data');
			}

			var ticker = data.result[pair];
			done(null, {
				datetime: new Date(),
				bid: ticker.b[0],
				ask: ticker.a[0],
				last: ticker.c[0],
			});
		});
	}
}
