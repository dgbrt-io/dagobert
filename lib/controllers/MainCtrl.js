var path    = require('path')
  , config  = require('../../config');

module.exports.get = function (req, res) {
	res.sendFile(path.join('static', 'index.html'), { root: config.baseDir });
};
