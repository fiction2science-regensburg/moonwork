$(document).ready(function() {
  updateEvents();
});

function updateEvents() {
  $.getJSON('http://localhost:3100/calender', function(events) {
    //events = [ {start: 70, end: 130},{start:160, end:220}, {start: 540, end: 600},  {start: 610, end: 670} ];
    layOutDay(events);
  });
}
/*//default events given
const events = [ {start: 70, end: 130},{start:160, end:220}, {start: 540, end: 600},  {start: 610, end: 670} ];

layOutDay(events);

//function to generate mock events for testing
function generateMockEvents (n) {
  let events = [];
  let minutesInDay = 60 * 12;

  while (n > 0) {
    let start = Math.floor(Math.random() * minutesInDay)
    let end = start + Math.floor(Math.random() * (minutesInDay - start));
    events.push({start: start, end: end})
    n --;
  }

  return events;
}*/
