var Asset = require('../models/Asset');
var Yahoo = require('../services/YahooSrvc');


module.exports.post = function (req, res) {
	Asset.find({}, function (err, assets) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		assets.forEach(function (asset) {
			Yahoo.yql('select * from yahoo.finance.quotes where symbol = "' + asset.symbol + '"', function (err, res) {
				if (err) {
					return console.error(err);
				}
				asset.quotes.push({
					datetime: new Date(),
					exchange: res.quote['StockExchange'],
					bid: res.quote['Bid'],
					ask: res.quote['Ask'],
					last: res.quote['LastTradePriceOnly']
				});
				asset.save(function (err, asset) {
					if (err) {
						return console.error(err);
					}
					console.log('Asset quotes updated for asset ' + asset.symbol);
				})
			})
		});
		res.status(202).send();
	});
};
