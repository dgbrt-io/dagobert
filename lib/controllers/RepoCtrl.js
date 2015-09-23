var rest = require('restler');
var _ = require('underscore');
var Repo = require('../models/Repo');
var config = require('../../config');
var logger = require('../logger');

module.exports.activate = function (req, res) {
	if (!req.body.id) {
		logger.trace('[RepoCtrl]', 'Request did not provide repo id');
		return res.status(400).send({ code: 400, msg: 'You need to provide a repository to activate' });
	}

	var repoId = req.body.id;

	logger.trace('Creating repo...');

	// Create repo
	Repo.findOne({ repoId : repoId }, function (err, repo) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}

		if (!repo) {
			return Repo.create({ repoId: repoId }, function (err, repo) {
				if (err) {
					logger.error(err);
					return res.status(500).send(err);
				}


				logger.trace('[RepoCtrl]', 'Repo created');
				res.send({ code: 201, msg: 'Repo activated.' });
			});
		}
		else {
			return res.send({ code: 200, msg: 'Repo already activated.' });
		}
	});

		// // Add hook
		// rest.get(config.github.baseUrl + '/repositories/' + repoId)
		// 	.success(function (repo) {

		// 		var hook = {
		// 			'name': 'web',
		// 			'events': ['push', 'pull_request'],
		// 			'active': true,
		// 			'config': {
		// 				'url': process.env.BASE_URL,
		// 				'content-type': 'json'
		// 			}
		// 		};

		// 		rest.post(config.github.baseUrl + '/repos/' + repo.full_name + '/hooks', hook)
		// 			.success(function (data) {

		// 				logger.trace('[RepoCtrl]', 'Repo hook added.');
		// 				res.send({ code: 201, msg: 'Repo activated and web hook added.' });
		// 			})
		// 			.error(function (err) {
		// 				logger.error(err);
		// 				return res.status(500).send(err);
		// 			});
		// 	})
		// 	.error(function (err) {
		// 		logger.error(err);
		// 		return res.status(500).send(err);
		// 	});
	  // });
};

module.exports.deactivate = function (req, res) {
	if (!req.params['repoId']) {
		return res.status(400).send({ code: 400, msg: 'You need to provide a repository to deactivate' });
	}

	var repoId = req.params['repoId'];

	Repo.remove({ repoId: repoId },
		function (err, repo) {
			if (err) {
				logger.error(err);
				return res.status(500).send(err);
			}
			logger.debug('[RepoCtrl]', 'Repo deactivated');
			res.status(204).send({ code: 204, msg: 'Repo deactivated.' });
		});
};
