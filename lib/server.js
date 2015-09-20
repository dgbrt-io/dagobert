var app = require('./app');
var logger = require('./logger');
var http = require('http').Server(app);
var amqp = require('amqplib/callback_api');
var io = require('socket.io')(http);



io.on('connection', function(socket){
  logger.trace('[', 'socket.io', ']', 'A new client connected');
  socket.emit('hello', 'Hello from WebSocket server', function (err) {
    if (err) return logger.error(err);
    logger.trace('[', 'socket.io', ']', 'Said Hello');
  });
  socket.on('hello', function(msg){
    logger.trace('[', 'socket.io', ']', 'Received hello message: ', msg);
  });
  socket.on('disconnect', function(){
    logger.trace('[', 'socket.io', ']', 'A client disconnected');
  });
});

amqp.connect('amqp://' + (process.env.RABBIT_HOST || 'localhost'), function(err, conn) {
  if (err) {
    return logger.error(err);
  }

  conn.createChannel(function(err, ch) {
    if (err) {
      return logger.error(err);
    }

    var ex = 'quotes';
    ch.assertExchange(ex, 'fanout', { durable: false });
    ch.assertQueue('', { exclusive: true }, function(err, q) {

      logger.trace('[', 'RabbitMQ', ']', 'Waiting for messages in %s', q.queue);

      ch.bindQueue(q.queue, ex, '');
      ch.consume(q.queue, function(msg) {

        var msg = JSON.parse(msg.content.toString());

        logger.trace('[', 'RabbitMQ', ']', 'Message received:', msg);

        io.sockets.emit(msg.pair, msg);
      }, {noAck: true});
    });
  });
});

module.exports.http = http;
module.exports.io = io;
