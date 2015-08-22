var app = require('./lib/app');
var mongoose = require('mongoose');

console.log('TODO remove. SECRET: ' + process.env.SECRET);
var uri = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/'
	+ (process.env.DB_NAME || 'dagobert_mdw');
console.log('Connecting to ' + uri);
mongoose.connect(uri, function (err) {
	if (err) {
		return console.error(err);
	}
	console.log('Connected to ' + uri);

	var server = app.listen(process.env.PORT || 8000, function () {
	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('App listening at http://%s:%s', host, port);
	});
});
