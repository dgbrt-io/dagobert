var rest = require('restler');

function yql (q, done) {
	var query = rest.get('https://query.yahooapis.com/v1/public/yql', {
		query: {
			'q': q,
			'format': 'json',
			'env': 'store://datatables.org/alltableswithkeys'
		}
	})

	query.on('error', function (err) {
		done(err, null);
	})
	.on('success', function (res) {
		done(null, res.query.results);
	});
}


module.exports = {
	name : 'yahoo',
	getQuote: function (asset, done) {

		var query = 'select * from yahoo.finance.quotes where symbol = "' + asset.symbol + '"';

		yql(query, function (err, res) {
			if (err) {
				console.error(err);
				return done(err, null);
			}

			var quote = {
				datetime: new Date(),
				bid: res.quote['Bid'],
				ask: res.quote['Ask'],
				last: res.quote['LastTradePriceOnly']
			};

			done(null, quote);
		});
	}
}
