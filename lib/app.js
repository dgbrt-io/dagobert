var express = require('express');
var bodyParser = require('body-parser')
var app = express();


var util = require('./util');
var RateCtrl = require('./controllers/AssetCtrl');
var PollMarkets = require('./controllers/PollMarketsCtrl');

app.use(bodyParser.json());
app.use(function (req, res, next) {
	if (process.env.SECRET === req.get('Secret')) {
		return next();
	}
  res.status(403).send(util.error(403, 'Invalid secret'));
});


app.get('/assets/:pair', RateCtrl.getByPair);
app.get('/assets', RateCtrl.all);
app.post('/assets', RateCtrl.post);

app.get('/poll_markets', PollMarkets.pollMarkets);


module.exports = app;
