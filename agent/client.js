
let allCalenders =
// {
//   maria: [
//     {title: 'Night',              date: '2018-09-29', start: '0:00',  end: '6:00',   level:0 },
//     {title: 'Homework',           date: '2018-09-29', start: '06:00',  end: '8:00',   level:0 },
//     {title: 'Doctor with Max',    date: '2018-09-29',start: '12:00',  end: '13:00',  level:0 },
//     {title: 'Dinner with family', date: '2018-09-29', start: '18:00', end: '19:00',  level:0 }
//   ],
//   tom: [
//     {title: 'Night',              date: '2018-09-29', start: '0:00',  end: '6:00',   level:0 },
//     {title: 'School',             date: '2018-09-29', start: '7:00',  end: '12:00',  level:0 },
//     {title: 'Doctor with Mom',    date: '2018-09-29', start: '12:00', end: '13:00',  level:0 },
//     {title: 'Dinner with family', date: '2018-09-29', start: '18:00', end: '19:00',  level:0 }
//   ]
// };

{
  maria: [
    {title: 'Night', date: '2018-09-29', start: '00:00',  end: '06:00',   level:0 },
    {title: 'breakfest', date: '2018-09-29', start: '06:00',  end: '07:00',   level:0 },
    {title: 'driving to shool and work',   date: '2018-09-29', start: '07:00',  end: '08:00',   level:0 },
    {title: 'meeting', date: '2018-09-29',start: '09:00',  end: '11:00',  level:0 },
    {title: 'business lunch', date: '2018-09-29', start: '12:00', end: '14:00',  level:0 },
    {title: 'work on project', date: '2018-09-29', start: '14:00', end: '16:00',  level:0 },
    {title: 'work on project', date: '2018-09-29', start: '18:00', end: '20:00',  level:0 },
    {title: 'dinner', date: '2018-09-29', start: '20:00', end: '22:00',  level:0 },
    {title: 'Night', date: '2018-09-29', start: '22:00', end: '23:00',  level:0 }
  ],
  lukas: [
    {title: 'Night', date: '2018-09-29', start: '00:00',  end: '06:00',   level:0 },
    {title: 'breakfast', date: '2018-09-29', start: '06:00',  end: '07:00',  level:0 },
    {title: 'driving to shool', date: '2018-09-29', start: '07:00',  end: '08:00',  level:0 },
    {title: 'shool', date: '2018-09-29', start: '08:00', end: '13:00',  level:0 },
    {title: 'grandma', date: '2018-09-29', start: '13:00', end: '16:00',  level:0 },
    {title: 'Dinner with family', date: '2018-09-29', start: '20:00', end: '22:00',  level:0 }
  ],
  kim: [
    {title: 'Night', date: '2018-09-29', start: '00:00',  end: '06:00',   level:0 },
    {title: 'breakfast', date: '2018-09-29', start: '06:00',  end: '07:00',  level:0 },
    {title: 'driving to shool', date: '2018-09-29', start: '07:00',  end: '08:00',  level:0 },
    {title: 'shool', date: '2018-09-29', start: '08:00', end: '16:00',  level:0 },
    {title: 'Dinner with family', date: '2018-09-29', start: '20:00', end: '22:00',  level:0 }
  ],
  tom: [
    {title: 'Night', date: '2018-09-29', start: '00:00',  end: '06:00',   level:0 },
    {title: 'breakfast', date: '2018-09-29', start: '06:00',  end: '09:30',  level:0 },
    {title: 'driving to work', date: '2018-09-29', start: '07:00',  end: '08:00',  level:0 },
    {title: 'customer meeting', date: '2018-09-29', start: '08:00', end: '12:00',  level:0 },
    {title: 'lunch', date: '2018-09-29', start: '12:00', end: '13:00',  level:0 },
    {title: 'office meeting', date: '2018-09-29', start: '13:00', end: '15:00',  level:0 },
    {title: 'work on project', date: '2018-09-29', start: '19:10', end: '20:00',  level:0 },
    {title: 'dinner', date: '2018-09-29', start: '20:00', end: '22:00',  level:0 },
    {title: 'Night', date: '2018-09-29', start: '22:00', end: '23:00',  level:0 }
  ],
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


// --------------------------------------------
// api for one way communication
if (agentId === 'maria') {
  var cors = require('cors');
  var express = require('express')
  var app = express();
  app.use(cors())
  // respond with "hello world" when a GET request is made to the homepage
  app.get('/calender', function (req, res) {
    console.log('api: /calender');
    let cal = [];
    calender.forEach(function(c) {
      console.log('date---->'+c.date);
      let cStartDate = new Date(c.date + 'T' + c.start+'Z');
      let cEndDate = new Date(c.date + 'T' + c.end+'Z');
      cal.push(Object.assign({}, c, convertSpan(cStartDate, cEndDate)));
    });
    res.send(JSON.stringify(cal));
  });
  app.listen(3100, function () {
    console.log('Api listening on port ' + 3100 + '!');
  });
}
// --------------------------------------------




var hub = require('socket.io-client')('http://localhost:3000');

console.log('I am the Shadow Agent of ' + agentId);

hub.on('connect', onConnect);

/*let format = new Intl.DateTimeFormat('de-DE', {year: 'numeric', month: 'numeric', day: 'numeric',
hour: 'numeric', minute: 'numeric', second: 'numeric'});*/





function onConnect(){
  console.log('My Socket is ' + hub.id);

  hub.on('wantsOccupationLevel', function(data) {
    handleWantsOccupationLevel(data);
  });

  //hub.send('asd');
  hub.emit('listen-for', {event: 'wantsOccupationLevel', agentId: agentId});


/*  if (agentId === 'maria') {
    // Test
    setTimeout(function() {
      let load = {
        type: 'meeting',
        participants: ['max'],
        date: '2018-09-29',
        duration: 1
      };
      handleScheduleRequest(null, load);
    }, 2000);
  }*/


}

// Connetion for the User Interface, just for maria
if (agentId === 'maria') {
  // Interface to UI
  let io = require('socket.io')(3003);
  io.on('connection', function(socket){
    console.log('web ui connected '+socket.id);

    socket.on('schedule', function(load) {
      handleScheduleRequest(socket, load);
    });

  });




}




function handleScheduleRequest(socket, load) {
  console.log((socket?socket.id:'') + ' wants to schedule', load);


  let currentHour = 0;

  testDate();

  function testDate() {

    let startDate = new Date(load.date);
    startDate.setHours(currentHour);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    let endDate = new Date();
    endDate.setTime(startDate.getTime());
    endDate.setHours(currentHour+load.duration);

    console.log(startDate, endDate);

    loadOccupation(startDate, endDate, load.participants).then(function(occupationLevels) {
      console.log(' occupationLevels', occupationLevels); //???

      // to improve
      let ok = true;
      for (let i in occupationLevels) {
        o = occupationLevels[i];
        if (o.occupationLevel < 1) {
          ok = false;
          break;
        }
      }

      if (!ok) {
        if (currentHour < 24) {
          currentHour++;
          testDate();
        } else {
          console.log("Scheduling Result: none");
          if (socket) {
            socket.emit('result', "none");
          }
        }
      } else {
        console.log("Scheduling Result", startDate, endDate);
        if (socket) {
          //startDate: "2018-09-29T11:00:00.000Z", endDate: "2018-09-29T12:00:00.000Z"}
          let diff = endDate - startDate;
          socket.emit('result', convertSpan(startDate, endDate));

          // add the event
          let event = {
            title: load.title,
            //date: startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate(),
            date: "2018-09-29",
            start:startDate.getUTCHours()+":00",
            end:endDate.getUTCHours()+":00",
            level:0
          };
          console.log(event);
          calender.push(event);
        }
      }
    });
  }

}


function loadOccupation(startDate, endDate, participants) {
  return new Promise(function(resolve, reject) {
    let occupationLevels = [{participant: agentId, occupationLevel: getMyOccupation(startDate, endDate)}]; // this is me first
    let requests = [];

    participants.forEach(function(participant) {
      //console.log('ask '+participant);
      requests.push(new Promise(function (resolve, reject) {
        hub.once('occupationLevel', function(occupationLevel) {
          //console.log(participant + ' said ' + occupationLevel);
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
  //console.log('Hub wantsOccupationLevel', format.format(startDate), format.format(endDate));
  hub.emit('occupationLevel', getMyOccupation(startDate, endDate));
}

function getMyOccupation(startDate, endDate) {
  for (let i in calender) {
    let c = calender[i];
    let cStartDate = new Date(c.date + 'T' + c.start+'Z');
    let cEndDate = new Date(c.date + 'T' + c.end+'Z');

    if (startDate >= cEndDate ) continue;
    if (endDate <= cStartDate ) continue;

    console.log('Da ist ein Termin: ', cStartDate, cEndDate, c.level);

    return c.level;
  }
  return 1;
}

function convertSpan(start, end) {
  return {start: start.getUTCHours()*60, end: end.getUTCHours()*60};
}
