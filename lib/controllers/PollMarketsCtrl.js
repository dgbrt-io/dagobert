var Asset = require('../models/Asset');
var AssetSrvc = require('../services/AssetSrvc');
var Yahoo = require('../services/YahooSrvc');
var _ = require('underscore');

function updateQuote(quote) {
	Asset.findOne({ symbol : quote.symbol }, function (err, asset) {
		if (err) {
			return console.error(err);
		}
		if (!asset) {
			return console.log('Asset not found');
		}

		asset.quotes.push({
			datetime: new Date(),
			exchange: quote['StockExchange'],
			bid: quote['Bid'],
			ask: quote['Ask'],
			last: quote['LastTradePriceOnly']
		});

		asset.save(function (err, res) {
			if (err) {
				return console.error(err);
			}
			console.log('Asset ' + quote.symbol + ' updated');
		});
	});
};


module.exports.pollMarkets = function (req, res) {
	AssetSrvc.all(function (err, assets) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.status(202).send();

		var symbols = assets.map(function (asset) {
			return asset.symbol;
		});

		var criteria = '(' + symbols.map(function(symbol) {
			return '"' + symbol + '"';
		}).join(',') + ')';

		var query = 'select * from yahoo.finance.quotes where symbol IN ' + criteria;

		Yahoo.yql(query, function (err, res) {
			if (err) {
				return console.error(err);
			}

			if (_.isArray(res.quote)) {
				_.each(res.quote, function (quote) {
					updateQuote(quote);
				});
			}
			else {
				updateQuote(res.quote);
			}
		});
	});
};
