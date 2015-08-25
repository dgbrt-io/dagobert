var rest = require('restler');

module.exports.yql = function (q, done) {
	var query = rest.get('https://query.yahooapis.com/v1/public/yql', {
		query: {
			'q': q,
			'format': 'json',
			'env': 'store://datatables.org/alltableswithkeys'
		}
	})

	query.on('error', function (err) {
		done(err, null);
	})
	.on('success', function (res) {
		done(null, res.query.results);
	});
}
