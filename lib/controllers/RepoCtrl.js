var rest = require('restler');
var _ = require('underscore');
var User = require('../models/User');
var config = require('../config');

module.exports.activatedRepos = function (req, res) {
	User.findOne({ githubId: req.user.githubId }, function (err, user) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}

		if (!user) {
			return res.status(404).send({ code: 404, msg: 'User not found'});
		}

		if (!user.repos) {
			user.repos = [];
		}

		res.send(user.repos);
	});
};

module.exports.activate = function (req, res) {
	if (!req.body.id) {
		return res.status(400).send({ code: 400, msg: 'You need to provide a repository to activate' });
	}

	var repoId = req.body.id;

	User.findOne({ githubId: req.user.githubId }, function (err, user) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}

		if (!user) {
			return res.status(404).send({ code: 404, msg: 'User not found'});
		}
		if (!user.repos) {
			user.repos = [];
		}

		if (_.where(user.repos, { id: repoId }).length === 0) {
			user.repos.push({
				id: repoId
			});
		}

		user.save(function (err, user) {
			if (err) {
				logger.error(err);
				return res.status(500).send(err);
			}

			rest.get(config.github.baseUrl + '/repositories/' + repoId)
				.success(function (repo) {

					var hook = {
						'name': 'web',
						'events': ['push', 'pull_request'],
						'active': true,
						'config': {
							'url': process.env.BASE_URL,
							'content-type': 'json'
						}
					};

					rest.post(config.github.baseUrl + '/repos/' + repo.full_name + '/hooks', hook)
						.success(function (data) {
							res.send({ code: 201, msg: 'Repo activated.' });
						})
						.error(function (err) {
							throw err;
						});
				})
				.error(function (err) {
					throw err;
				});
		});
	});
};

module.exports.deactivate = function (req, res) {
	if (!req.params['repoId']) {
		return res.status(400).send({ code: 400, msg: 'You need to provide a repository to deactivate' });
	}

	var repoId = req.params['repoId'];

	User.update({ githubId: req.user.githubId },
		{ $pull: { repos : { id : repoId } } },
		{ safe: true },
		function (err, user) {
			if (err) {
				logger.error(err);
				return res.status(500).send(err);
			}
			res.status(202).send({ code: 202, msg: 'Repo deactivated.' });
		});
};
