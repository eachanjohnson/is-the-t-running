// IS THE T RUNNING JS
function countDown ($obj) {
    
    // Every 60 seconds, check for a status change
    
    var $countdown = $obj,
        $text = parseInt($countdown.text()),
        windowHeight = $(window).height();  // get current timer value
    
    console.log($text);

    if ( $text > 0 ) {   // if we're not at 0 yet, count down 1 second
        
        var newNumber = $text - 1;
        
        $countdown.text(newNumber.toString());
        $('.timer-bar').css('bottom', 0 - windowHeight * (60 - newNumber) / 60);
        
        setTimeout(function() {
            countDown($obj);
        }, 1000);
    
    } else {
        
        $countdown.text('60');
        $('.timer-bar').css('bottom', 0 - windowHeight * 0 / 60);  // reset timers
        getAnswer();
    
    }
}

function alertsCallback (data) {
    
    // JSON AJAX callback
    
     var d = data.alerts,
         counter = 0,
         html = '<div class="delayed-services">',
         $placeholder = $('.placeholder');

    for ( var i = 0; i < d.length; i++ ) {  // scan data object
        //console.log( '-------' );
        var name = d[i].effect_name,
            life = d[i].alert_lifecycle,
            services = d[i].affected_services.services;

        //console.log( name + ' ' + life );
        if ( (name === 'Delay' || name === 'Cancellation') && (life === 'New' || life === 'Ongoing') ) {

            for ( var j = 0; j < services.length; j++ ) {  // Scan affected services

                if ( services[j].mode_name === 'Subway' ) {

                    var color = services[j].route_name.split(' Line')[0].toLowerCase(),  // get color from line name
                        severity = d[i].severity,
                        htmlToAdd = '<div style="color:' + color + '" class="' + color + '"><p>' +
                            severity + ' ' + name.toLowerCase() + ' on the ' + services[j].route_name + '</p></div>';

                    html += html.indexOf(htmlToAdd) == -1 ? htmlToAdd : '';  // Add if not already there

                    counter++;
                    
                } 
            }
        } 
    }

    html += '</div>';
    
    $placeholder.addClass('answer');
    
    if ( counter > 0 ) {  // if there are delays
        
        $('.answer h2').text('No.')
        $('.answer').append(html);
    
    } else {
        
        $('.answer h2').text('Yes.');
    
    }
}

function getAnswer () {
    
    // ping MBTA for delay info
    
    var $placeholder = $('.placeholder'),
        getJson = $.getJSON('http://realtime.mbta.com/developer/api/v2/alerts', {
        api_key: 'wX9NwuHnZU2ToO7GmGR9uw',
        format: 'json'
    })
        .done( function (data) {
            alertsCallback(data);
        })
        .complete( function () {
            countDown($('.countdown p'));
        });
    
    $placeholder.removeClass('.answer');
    $placeholder.text('');
    $placeholder.append('<h2>Finding out...</h2>');
    
}

function main () {
    
    // Main function
    
    var $countdown = $('.countdown p');
    
    countDown($countdown);
    
    $('.tweet-button').click(
        function () {
            
            var baseUrl = 'http://twitter.com/intent/tweet',
                textValue = 'I just found out if the T is delayed!',
                urlValue = 'http://eachanjohnson.com/is-the-t-running',
                hashtagsValue = 'mbta',
                relatedValue = 'eachanjohnson',
                url = encodeURI(baseUrl) + '?text=' +encodeURIComponent(textValue) + '&url=' +
                    encodeURIComponent(urlValue) + '&hashtags=' + encodeURIComponent(hashtagsValue) +
                    '&related=' + encodeURIComponent(relatedValue);
            
            window.open(url);
        }
    );
}

// Run on document load
$(document).ready(main);
