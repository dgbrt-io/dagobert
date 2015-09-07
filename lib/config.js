var _ = require('underscore');

module.exports.providers = _.map(require('fs').readdirSync('./lib/providers'), function (item) {
	return {
		name: item.replace('.js', '')
	}
});
