var path    = require('path')
  , config  = require('../../config');

module.exports.index = function (req, res) {
	res.sendFile(path.join('static', 'index.html'), { root: config.baseDir });
};
