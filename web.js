var app = require('./lib/app');
var mongoose = require('mongoose');
var logger = require('./lib/logger');
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  logger.trace('[', 'socket.io', ']', 'A new client connected');
  socket.emit('hello', 'Hello from WebSocket server', function (err) {
  	if (err) return logger.error(err);
  	logger.trace('[', 'socket.io', ']', 'Said Hello');
  });
  socket.on('hello', function(msg){
  	logger.trace('[', 'socket.io', ']', 'Received message: ', msg);
  });
  socket.on('disconnect', function(){
  	logger.trace('[', 'socket.io', ']', 'A client disconnected');
  });
});


var uri = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/'
	+ (process.env.DB_NAME || 'dagobert');
logger.info('Connecting to ' + uri);
mongoose.connect(uri, function (err) {
	if (err) {
		return logger.error(err);
	}

	logger.info('Connected to ' + uri);

	var server = http.listen(process.env.PORT || 8000, function () {
	  var host = server.address().address;
	  var port = server.address().port;

	  logger.info('App listening at http://%s:%s', host, port);
	});
});
