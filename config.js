var _ = require('underscore');

module.exports = {
	baseDir: __dirname,
	rabbitmq: {
		taskQueueName: 'task_queue',
		quotesExchangeName: 'quotes'
	},
	github : {
		baseUrl: 'https://api.github.com'
	},
	providers: _.map(require('fs').readdirSync('./lib/providers'), function (item) {
		return {
			name: item.replace('.js', '')
		}
	})
}
