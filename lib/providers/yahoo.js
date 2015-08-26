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
		asset: {
			symbol: quoteFromYahoo['Symbol'],
			currency: quoteFromYahoo['Currency']
		},
		quote: {
			datetime: new Date(),
			bid: quoteFromYahoo['Bid'],
			ask: quoteFromYahoo['Ask'],
			last: quoteFromYahoo['LastTradePriceOnly']
		}
	}
};


module.exports = {
	name : 'yahoo',
	getQuotes: function (assets, done) {

		var assetList = '(' + assets.map(function (asset) {
			return '"' + asset.symbol + '"';
		}).join(', ') + ')';
		var query = 'select * from yahoo.finance.quotes where symbol IN ' + assetList;

		yql(query, function (err, res) {
			if (err) {
				console.error(err);
				return done(err, null);
			}

			if (!res.quote) {
				return done('Invalid data', null);
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
	}
}
