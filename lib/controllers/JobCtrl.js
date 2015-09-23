
var util = require('../util');
var logger = require('../logger');
var Job = require('../models/Job');
var _ = require('underscore');

module.exports.get = function (req, res) {

	var jobId = req.params['jobId'];

	Job.findOne({ _id: jobId }, function (err, job) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}

		if (!job) {
			return res.status(404).send({ msg: 'Not found', code: 404 });
		}

		res.send(job);
	});
}

module.exports.allForRepoId = function (req, res) {
	Job.find({ repoId: req.params['repoId'] }, function (err, jobs) {
		if (err) {
			logger.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(jobs);
	});
};
