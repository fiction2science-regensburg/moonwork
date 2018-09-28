
let allCalenders =
{
  maria: [
    {title: 'Night',              date: '2018-09-28', start: '0:00',  end: '6:00',   level:4 },
    {title: 'Homework',           date: '2018-09-28', start: '6:00',  end: '8:00',   level:1 },
    {title: 'Doctor with Max',    date: '2018-09-28',start: '12:00',  end: '13:00',  level:2 },
    {title: 'Dinner with family', date: '2018-09-28', start: '18:00', end: '19:00',  level:4 }
  ],
  max: [
    {title: 'Night',              date: '2018-09-28', start: '0:00',  end: '6:00',   level:4 },
    {title: 'School',             date: '2018-09-28', start: '7:00',  end: '12:00',  level:3 },
    {title: 'Doctor with Mom',    date: '2018-09-28', start: '12:00', end: '13:00',  level:2 },
    {title: 'Dinner with family', date: '2018-09-28', start: '18:00', end: '19:00',  level:4 }
  ]
};



if (typeof process.argv[2] === 'undefined') {
  console.log('no agent id');
  return;
}

let agentId = process.argv[2];

if (typeof allCalenders[agentId] === 'undefined') {
  console.log('no calender for '+agentId);
  return;
}
let calender = allCalenders[agentId];
console.log(calender);

var hub = require('socket.io-client')('http://localhost:3000');

console.log('I am the Shadow Agent of ' + agentId);

hub.on('connect', onConnect);

let format = new Intl.DateTimeFormat('de-DE', {year: 'numeric', month: 'numeric', day: 'numeric',
hour: 'numeric', minute: 'numeric', second: 'numeric'});





function onConnect(){
  console.log('My Socket is ' + hub.id);

  hub.on('wantsOccupationLevel', function(data) {
    handleWantsOccupationLevel(data);
  });

  //hub.send('asd');
  hub.emit('listen-for', {event: 'wantsOccupationLevel', agentId: agentId});


  if (agentId === 'maria') {
    // Test
    setTimeout(function() {
      let load = {
        type: 'meeting',
        participants: ['max'],
        date: '2018-09-28',
        duration: 1
      };
      handleScheduleRequest(null, load);
    }, 2000);
  }


}


if (agentId === 'maria') {
  // Interface to UI
  let io = require('socket.io')(3001);
  io.on('connection', function(socket){
    //console.log(socket);

    socket.on('schedule', function(load) {
      handleScheduleRequest(socket, load);
    });

  });




}




function handleScheduleRequest(socket, load) {
  console.log((socket?socket.id:'') + ' wants to schedule', load);


  let currentHour = 0;

  let counter = 0;

  testDate();

  function testDate() {

    let startDate = new Date(load.date);
    startDate.setHours(currentHour);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    let endDate = new Date();
    endDate.setTime(startDate.getTime());
    endDate.setHours(currentHour+load.duration);
    console.log(format.format(startDate), format.format(endDate));

    loadOccupation(startDate, endDate, load.participants).then(function(occupationLevels) {
      counter++;
      console.log(counter + ' occupationLevels', occupationLevels); //???
      if (counter<24) {
        currentHour++;
        testDate();
      }
    });
  }

}


function loadOccupation(startDate, endDate, participants) {
  return new Promise(function(resolve, reject) {
    let occupationLevels = [getMyOccupation(startDate, endDate)]; // this is me first
    let requests = [];

    participants.forEach(function(participant) {
      console.log('ask '+participant);
      requests.push(new Promise(function (resolve, reject) {
        hub.once('occupationLevel', function(occupationLevel) {
          console.log(participant + ' said ' + occupationLevel);
          occupationLevels.push({participant: participant, occupationLevel: occupationLevel});
          resolve();
        });
        let requestLoad = {
          startDate: startDate,
          endDate: endDate
        };
        hub.emit('call', {function: 'wantsOccupationLevel', load: requestLoad, agentId: participant});
      }));
    });

    Promise.all(requests).then(function() {
      resolve(occupationLevels);
    });
  });


  /*let result = requestLoad;
  if (socket) {
    socket.emit('suggestion', result);
  } else {
    console.log('Result: ', result);
  }*/

}




function handleWantsOccupationLevel(data) {
  let startDate = new Date(data.startDate);
  let endDate = new Date(data.endDate);
  console.log('Hub wantsOccupationLevel', format.format(startDate), format.format(endDate));
  hub.emit('occupationLevel', getMyOccupation(startDate, endDate));
}

function getMyOccupation(startDate, endDate) {
  for (let i in calender) {
    let c = calender[i];
    let cStartDate = new Date(c.date + ' ' + c.start);
    let cEndDate = new Date(c.date + ' ' + c.end);

    if (startDate >= cEndDate ) continue;
    if (endDate <= cStartDate ) continue;

    console.log('Da ist ein Termin: ', format.format(cStartDate), format.format(cEndDate), c.level);

    return c.level;
  }
  return 0;
}
