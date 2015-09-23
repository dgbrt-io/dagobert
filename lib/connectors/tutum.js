var Tutum = require('tutum');
var WebSocketClient = require('websocket').client;
var logger = require('../logger');

var tutum = new Tutum({
	username: process.env.TUTUM_USERNAME,
	apiKey: process.env.TUTUM_API_KEY
});

var queryparams = { user: process.env.TUTUM_USERNAME, token: process.env.TUTUM_API_KEY };

tutum.stream = function (endpoint, options, callback) {

	callback = (typeof options === 'function') ? options : callback;

	var uri = (options.baseUrl || 'wss://stream.tutum.co');
	uri += '/' + (options.apiVersion || 'v1');
	uri += endpoint;
	uri += '?' + Object.keys(queryparams).map(function (key) {
		return key + '=' + queryparams[key]
	}).join('&');

	var client = new WebSocketClient();

	client.on('connect', function (connection) {
		logger.debug('connected')
		return callback(null, connection);
	});

	client.on('connectFailed', function (err) {
		return callback(err);
	});

	client.connect(uri);
}

module.exports = tutum;
