var rest = require('restler');

module.exports.yql = function (q, done) {
	rest.get('https://query.yahooapis.com/v1/public/yql', {
		query: {
			'q': q,
			'format': 'json',
			'env': 'store://datatables.org/alltableswithkeys'
		}
	})
	.on('error', function (err) {
		done(err, null);
	})
	.on('success', function (res) {
		done(null, res.query.results);
	});
}
