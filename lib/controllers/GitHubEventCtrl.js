var util = require('../util');
var config = require('../../config');
var logger = require('../logger');
var rest = require('restler');
var Repo = require('../models/Repo');
var Job = require('../models/Job');
var _ = require('underscore');
var async = require('async');
var rabbitmq = require('../rabbitmq');

module.exports.post = function (req, res) {

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
				status: 'waiting',
				commit: req.body.commit,
				logs: []
			}, function (err, job) {
				if (err) {
					return logger.error(err);
				}

				// Send message to queue
				var ch = rabbitmq.getTasksChannel();
				ch.assertQueue(config.rabbitmq.taskQueueName, { durable: true });
				ch.sendToQueue(config.rabbitmq.taskQueueName, new Buffer(JSON.stringify(job)), { persistent: true });

				res.status(201).send(job);

			});
		});
	})

}
