var _ = require('underscore');

module.exports.github = {
	baseUrl: 'https://api.github.com'
};
module.exports.providers = _.map(require('fs').readdirSync('./lib/providers'), function (item) {
	return {
		name: item.replace('.js', '')
	}
});
