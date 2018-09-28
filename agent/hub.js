var io = require('socket.io')(3000);

let connections = [];
let listen = [];

io.on('connection', function(socket){
  //console.log(socket);
  connections[socket.id] = socket;
  console.log('a agentClient connected: '+socket.id);
  socket.on('disconnect', function(){
    connections[socket.id] = null;
    console.log('agentClient disconnected: '+socket.id);
  });


  socket.on('listen-for', function(channel) {
    console.log(channel.agentId + ' listen for ' + channel.event);
    if (typeof listen[channel.event] === 'undefined') {
      listen[channel.event] = [];
    }
    socket.agentId = channel.agentId;
    listen[channel.event].push(socket);
  });

  socket.on('call', function(data) {
    console.log('call ', data);
    if (typeof listen[data.function] === 'undefined') return;
    listen[data.function].forEach(function(l) {
      if (!listen[data.function]) return;
      if (l.agentId === data.agentId) {
        console.log('calling '+l.agentId);
        l.once('occupationLevel', function(level) {
          console.log('answer from '+l.agentId + ' '+ level);
          socket.emit('occupationLevel', level);
        });
        l.emit(data.function, data.load);
      }
    });
  });




  /*socket.send('asd');*/
});
