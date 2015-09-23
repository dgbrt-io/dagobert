
var io = require('socket.io')(require('./http'));
var logger = require('./logger');

io.on('connection', function(socket){
  logger.trace('[Socket.io]', 'A new client connected');
  socket.emit('hello', 'Hello from WebSocket server', function (err) {
    if (err) return logger.error(err);
    logger.trace('[Socket.io]', 'Said Hello');
  });
  socket.on('hello', function(msg){
    logger.trace('[Socket.io]', 'Received hello message: ', msg);
  });
  socket.on('disconnect', function(){
    logger.trace('[Socket.io]', 'A client disconnected');
  });
});

module.exports = io;
