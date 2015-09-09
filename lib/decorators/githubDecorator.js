var _ = require('underscore');
var logger = require('../logger');
var User = require('../models/User');

module.exports.decorate = function (user, requestUrl, data, done) {

	if (requestUrl === '/user/repos') {
		logger.debug('Decorating', requestUrl);
		var repos = data;
		return User.findOne({ githubId: user.githubId }, function (err, user) {
			if (err) {
				return done(err, null);
			}

			repos = _.map(repos, function (repo) {
				if (_.where(user.repos, { id: repo.id }).length > 0) {
					repo.dagobert = {
						activated: true
					};
				}
				return repo;
			});

			return done(null, repos);
		});
	}
	logger.debug('Not decorating', requestUrl);

	return done(null, data);
}
