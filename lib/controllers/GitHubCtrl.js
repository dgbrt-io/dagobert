
var util = require('../util');
var config = require('../config');
var logger = require('../logger');
var rest = require('restler');
var User = require('../models/User');
var _ = require('underscore');

['get', 'post', 'put', 'delete'].forEach(function (method) {
	module.exports[method] = function (req, res) {
		User.findOne({ githubId: req.user.githubId }, function (err, user) {
			if (err) {
				logger.error(err);
				return res.status(500).send(err);
			}

			var path = req.originalUrl.replace('/github', '');
			var url = config.github.baseUrl + path;
			logger.trace('[', 'GitHubCtrl', ']', 'Requesting', url);
			rest[method](url, {
				headers: { 'User-Agent':'dgbrt.io', 'Authorization':'token ' + user.accessToken },
				query: req.query
			}).on('complete', function(data, response) {
				res.status(response.statusCode).send(data);
			});
		});
	}
});
