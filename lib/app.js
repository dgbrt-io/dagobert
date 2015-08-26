var express = require('express');
var bodyParser = require('body-parser');
var cuid = require('cuid');
var app = express();


var util = require('./util');
var AssetCtrl = require('./controllers/AssetCtrl');
var PollMarkets = require('./controllers/PollMarketsCtrl');

app.use(bodyParser.json());
app.use(function (req, res, next) {
  req.requestId = cuid();
  next();
});
app.use(function (req, res, next) {
  console.log(req.requestId, req.method, req.originalUrl, req.query);
  next();
});
app.use(function (req, res, next) {

	if (process.env.SECRET === req.get('Secret')) {
		return next();
	}
	console.error(req.requestId, 'Request not authorized');
  res.status(403).send(util.error(403, 'Invalid secret'));
});


app.get('/assets/:pair', AssetCtrl.getByPair);
app.get('/assets', AssetCtrl.all);
app.post('/assets', AssetCtrl.post);

app.get('/poll_markets', PollMarkets.pollMarkets);


module.exports = app;
