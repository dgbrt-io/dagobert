var _ = require('underscore');

module.exports.providers = _.map(require('fs').readdirSync('./lib/providers'), function (provider) {
	return require('./providers/' + provider);
});
