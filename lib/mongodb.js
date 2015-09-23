var mongoose = require('mongoose');

module.exports = function (done) {
	var mongoDbUri = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/'
		+ (process.env.DB_NAME || 'dagobert');
	mongoose.connect(mongoDbUri, function (err) {
		if (err) {
			return done(err);
		}
		return done(null);
	});
}
