var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var RateCtrl = require('./controllers/AssetCtrl');
var PollMarkets = require('./controllers/PollMarketsCtrl');

app.use(bodyParser.json());
app.use(function (req, res, next) {
	if (process.env.SECRET === req.get('Secret')) {
		return next();
	}
  res.status(403).send('Invalid secret');
});

app.get('/assets', RateCtrl.get);
app.post('/assets', RateCtrl.post);

app.get('/poll_markets', PollMarkets.post);


module.exports = app;
