var _ = require('underscore');
var logger = require('../logger');
var Repo = require('../models/Repo');

module.exports.decorate = function (user, requestUrl, data, done) {

	if (requestUrl === '/user/repos') {
		logger.trace('Decorating', requestUrl);
		var repos = data;
		var repoIds = repos.map(function (repo) {
			return repo.id;
		});
		return Repo.find({ repoId: { $in : repoIds } }, function (err, reposFromDb) {
			if (err) {
				return done(err, null);
			}

			repos = _.map(repos, function (repo) {
				if (_.where(reposFromDb, { repoId: repo.id }).length > 0) {
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
