var rest = require('restler');
var _ = require('underscore');

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

function transform (quoteFromYahoo) {
	return {
		datetime: new Date(),
		bid: quoteFromYahoo['Bid'],
		ask: quoteFromYahoo['Ask'],
		last: quoteFromYahoo['LastTradePriceOnly'],
		pair: quoteFromYahoo['Symbol'] + '_' + quoteFromYahoo['Currency']
	}
};


module.exports = {
	name : 'yahoo',
	getQuotes: function (assetPairs, done) {
		process.nextTick(function () {

			var assetList = '(' + assetPairs.map(function (assetPair) {
				var symbol = assetPair.pair.split('_')[0];

				return '"' + symbol + '"';
			}).join(', ') + ')';
			var query = 'select * from yahoo.finance.quotes where symbol IN ' + assetList;

			yql(query, function (err, res) {
				if (err) {
					return done(err, null);
				}

				if (!res) {
					return done('Yahoo provider: Invalid response', null);
				}

				if (!res.quote) {
					return done('Yahoo provider: Invalid quote', null);
				}

				if (res.quote instanceof Array) {
					return done(null, _.map(res.quote, function (quote) {
						return transform(quote);
					}));
				}
				else {
					return done(null, [transform(res.quote)]);
				}
			});
		});
	}
}
