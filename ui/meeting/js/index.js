(function( $ ) {
  'use strict';
  
  // polyfill support for date input
  if ( document.getElementById( 'date' ).type !== 'date' ) {
    $( '#date' ).datepicker({ dateFormat: 'yy-mm-dd' });
  }
  // polyfill support for time input
  // if ( document.getElementById( 'time' ).type !== 'time' ) {
  //   $( '#time' ).timepicker({
  //     timeFormat: 'H:i',
  //     scrollDefaultNow: true
  //   });
  // }
  
  $('#duration-picker').durationPicker();

  $( "#submitForm" ).click(function() {
    alert(formData);
  });

  $.to_seconds = function(dd,hh,mm) {
    d = parseInt(dd);
    h = parseInt(hh);
    m = parseInt(mm);
    if (isNaN(d)) d = 0;
    if (isNaN(h)) h = 0;
    if (isNaN(m)) m = 0;
  
    t = d * 24 * 60 * 60 +
        h * 60 * 60 +
        m * 60;
    return t;
  }
  
  // expects 1d 11h 11m, or 1d 11h,
  // or 11h 11m, or 11h, or 11m, or 1d
  // returns a number of seconds.
  $.parseDuration = function(sDuration) {
    if (sDuration == null || sDuration === '') return 0;
    mrx = new RegExp(/([0-9][0-9]?)[ ]?m/);
    hrx = new RegExp(/([0-9][0-9]?)[ ]?h/);
    drx = new RegExp(/([0-9])[ ]?d/);
    days = 0;
    hours = 0;
    minutes = 0;
    if (mrx.test(sDuration)) {
      minutes = mrx.exec(sDuration)[1];
    }
    if (hrx.test(sDuration)) {
      hours = hrx.exec(sDuration)[1];
    }
    if (drx.test(sDuration)) {
      days = drx.exec(sDuration)[1];
    }
  
    return to_seconds(days, hours, minutes);
  }

  $( 'form' ).on( 'submit', function( event ) {

    // construct URL
    var form = this,
        //URL = 'http://arewemeetingyet.com/',
        params = [ 'title', 'date', 'duration', 'participants' ]
    ;

    params = params.map(function( name ) {
      return form.elements[ name ].value;
    }).filter(function( value ) {
      return !! value;
    });
    
    // keep the timezone, lose the continent
    //params[ 0 ] = params[ 0 ].replace( /^.*\/(.*)$/, '$1' );
    // replace spaces with underscore in timezone
    //params[ 0 ] = params[ 0 ].replace( /\s+/g, '_' );
   
    // encode all params and append to URL
    // URL += params
    //   .map( encodeURIComponent )
    //   .join( '/' )
    //   // replace %3A with ':' (%3A not handled)
    //   .replace( /%3A/g, ':' )
    // ;
    
    // print URL
    $( this ).after( '<a class="meeting">' + '</a>' );
    
    event.preventDefault();
    return false;
  });

  var participants = [];
  $('#example-collapse').multiselect({
    buttonText: function(options, select) {
      if (options.length === 0) {
          return 'No participants are selected';
      }
      else if (options.length > 3) {
          return 'More than 3 participants!';
      }
       else {
           var labels = [];
           options.each(function() {
               if ($(this).attr('label') !== undefined) {
                   labels.push($(this).attr('label'));
                   participants.push($(this).attr('label'));
               }
               else {
                   labels.push($(this).html());
               }
           });
           return labels.join(', ') + '';
       }
  }
  });
  
  function submitForm() {
    alert('this function is called');
  }


}( jQuery ));