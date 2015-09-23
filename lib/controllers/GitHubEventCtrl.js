var util = require('../util');
var config = require('../config');
var logger = require('../logger');
var rest = require('restler');
var Repo = require('../models/Repo');
var _ = require('underscore');

module.exports.post = function (req, res) {
	logger.trace(req.body);

	if (!req.body) {
		return res.status(400).send({ msg: 'Invalid body', code: 400 });
	}

	if (!req.body.repository) {
		return res.status(400).send({ msg: 'No repository provided', code: 400 });
	}

	if (!req.body.repository.id) {
		return res.status(400).send({ msg: 'No repository ID provided', code: 400 });
	}


	Repo.findOne({ repoId: req.body.repository.id }, function (err, repo) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}

		if (!repo) {
			return res.status(404).send({ msg: 'Repository not activated', code: 404 });
		}

		async.forEach(req.body.commits, function (commit) {

			Job.create({
				repoId: req.body.repository.id,
				status: 'Waiting for worker...',
				commit: req.body.commit,
				logs: []
			}, function (err, job) {
				if (err) {
					return logger.error(err);
				}

				// Send message to queue

			res.status(202).send({ msg: 'Accepted', code: 202 });

			});
		});
	})

}
