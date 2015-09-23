var config = require('../../config');

module.exports.all = function (req, res) {
	res.send(config.providers);
};
