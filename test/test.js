// Random Script for testing

/* jshint boss: true, curly: true, eqeqeq: true, eqnull: true, immed: true, latedef: true, newcap: true, noarg: true, browser: true, jquery: true, noempty: true, sub: true, undef: true, unused: true, white: false */

( function( $ ) {

    var gMap,
        gStartPosition = new google.maps.LatLng( 0, 0 ),
        gMarker = new google.maps.Marker(),
        $headTitle,
        $userDD,
        $userPicture,
        $userDDAge,
        $userDDSize,
        $userDDWeight;

    // TODO Hey, i'm here !
    var displayGoogleMap = function() {
        gMap = new google.maps.Map( document.getElementById( "gmap" ), {
            center: gStartPosition,
            zoom: 1,
            backgroundColor: "rgba( 0, 0, 0, 0 )", // NOTE Are you sure you can do that ?!
            styles: [
                {
                    featureType: "water",
                    stylers: [
                        { visibility: "off" }
                    ]
                },
                {
                    featureType: "landscape",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        } );
    }; // displayGoogleMap

    var loadPersonData = function( e ) {
        e.preventDefault();
        // TODO define method for AJAX request
        $.ajax( {
            url: "data/person.php",
            dataType: "json",
            success: function( oResponse ) {
                if( oResponse.error ) {
                    $headTitle.addClass( "error" ).text( "Erreur: Données incomplètes" );
                    $userDD.text( "?" );
                    $userPicture.attr( "src", "http://placehold.it/250" );
                    gMap.setCenter( gStartPosition );
                    gMap.setZoom( 1 );
                    gMarker.setMap( null );
                } else {
                    displayPerson( oResponse.data );
                    // FIXME Check for compatibility !
                    history.pushState( oResponse.data, oResponse.data.name, oResponse.data.name.toLowerCase().replace( " ", "" ) + ".html" );
                }
            }
        } );
    }; // loadPersonData

    var displayPerson = function( oPerson ) {
        var gPersonPosition = new google.maps.LatLng( oPerson.position.latitude, oPerson.position.longitude );
        $headTitle.removeClass( "error" ).text( oPerson.name );
        $userDDAge.text( oPerson.age );
        $userDDSize.text( oPerson.size );
        $userDDWeight.text( oPerson.weight );
        $userPicture.attr( "src", "." + oPerson.photo );
        gMap.panTo( gPersonPosition );
        gMap.setZoom( 12 );
        gMarker.setMap( gMap );
        gMarker.setPosition( gPersonPosition );
    }; // displayPerson

    var historyHasChanged = function( e ) {
        if( e.state ) {
            displayPerson( e.state );
        }
    }; // historyHasChanged

    $( function() {
        displayGoogleMap();

        $headTitle = $( "h1" );
        $userDD = $( "dd" );
        $userPicture = $( "#picture img" );
        $userDDAge = $( "dd.age" );
        $userDDSize = $( "dd.size" );
        $userDDWeight = $( "dd.weight" );

        $( "#button a" ).on( "click", loadPersonData );

        $( "#map" ).css( "pointer-events", "none" );
        $( "#gmap" ).css( "pointer-events", "auto" );

        window.addEventListener( "popstate", historyHasChanged );
    } );

} ).call( this, jQuery );
