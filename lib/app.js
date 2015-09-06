var express = require('express');
var bodyParser = require('body-parser');
var cuid = require('cuid');
var path = require('path');
var config = require('../config');
var util = require('./util');
var AssetCtrl = require('./controllers/AssetCtrl');
var MainCtrl = require('./controllers/MainCtrl');
var logger = require ('./logger');


var app = express();

// Middlewares
app.use(bodyParser.json());
app.use(function (req, res, next) {
  req.requestId = cuid();
  next();
});
app.use(function (req, res, next) {
  logger.debug(req.requestId, req.method, req.originalUrl, req.query);
  next();
});

var secureMiddleware = function (req, res, next) {

	if (process.env.SECRET === req.get('Secret')) {
		return next();
	}
	logger.error(req.requestId, 'Request not authorized');
  res.status(403).send(util.error(403, 'Invalid secret'));
};

app.use('/static', express.static(path.join(config.baseDir, 'static')));

// Routes
app.get('/assets/:pair/quotes', AssetCtrl.getQuotesForAsset);
app.get('/assets', AssetCtrl.all);
app.post('/assets', secureMiddleware, AssetCtrl.addAsset);
app.get('/', MainCtrl.index);

module.exports = app;
