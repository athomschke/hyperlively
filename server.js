// @flow

// modules
var staticModule = require( 'node-static' ),
	port = 8080,
	http = require( 'http' );

// config
var file = new staticModule.Server( './', {
	cache: 3600,
	gzip: true
} );

// serve
http.createServer( function ( request, response ) {
	response.setHeader('Access-Control-Allow-Origin', '*');
	request.addListener( 'end', function () {
		file.serve( request, response );
	} ).resume();
} ).listen( port );
