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
    console.log('call ', data.agentId, data.load.startDate, data.load.endDate);
    if (typeof listen[data.function] === 'undefined') return;
    listen[data.function].forEach(function(l) {
      if (!listen[data.function]) return;
      if (l.agentId === data.agentId) {
        l.once('occupationLevel', function(level) {
          console.log('answer for ', data.agentId, data.load.startDate, data.load.endDate, level);
          socket.emit('occupationLevel', level);
        });
        l.emit('wantsOccupationLevel', data.load);
      }
    });
  });




  /*socket.send('asd');*/
});
