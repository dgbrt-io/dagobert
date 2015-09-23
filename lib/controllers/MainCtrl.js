var path    = require('path')
  , config  = require('../../config')
  , logger  = require('../logger');

var indexFile = 'index.html';

module.exports.get = function (req, res) {
	logger.trace('[MainCtrl]', 'Sending', indexFile, 'as index file');
	res.sendFile(path.join('static', indexFile), { root: config.baseDir });
};
