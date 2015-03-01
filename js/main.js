//// IS THE T RUNNING JS
function alertsCallback (data) {
     var d = data.alerts,
         counter = 0;

    for ( var i = 0; i < d.length; i++ ) {
        //console.log( '-------' );
        var name = d[i].effect_name,
            life = d[i].alert_lifecycle,
            services = d[i].affected_services.services;

        //console.log( name + ' ' + life );
        if( name === 'Delay' || name === 'Cancellation' ) {
            if ( life === 'New' || life === 'Ongoing' ) {
                for ( var j = 0; j < services.length; j++ ) {
                    if ( services[j].mode_name === 'Subway' ) {
                        counter++;
                    } else {
                        //console.log(services[j].mode_name);
                    }
                }
            } else {
                //
            }
        } else {
            //
        }
    }

    console.log(counter);
    if ( counter > 0 ) {
        $('.answer h2').text('No.');
    } else {
        $('.answer h2').text('Yes.');
    }
}


function getAnswer () {
    $.getJSON('http://realtime.mbta.com/developer/api/v2/alerts', {
        api_key: 'wX9NwuHnZU2ToO7GmGR9uw',
        format: 'json'
    })
        .done( function (data) {
            alertsCallback(data);
        });
}


//// Main function
function main () {
    getAnswer();
    setTimeout(getAnswer, 180000);
}

//// Run on document load
$(document).ready(main);
