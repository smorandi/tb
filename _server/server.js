/**
 * Created by Stefano on 25.07.2015.
 */

/**
 * Module dependencies.
 */
// Init the express application
var debug = require('debug')('tb_server:server');
var http = require('http');
var mongoose = require('mongoose');
var config = require('./config/config');
var app = require('./config/express');
var logger = require("./config/logger");

// Bootstrap db connection
var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    if (err) {
        logger.error('Could not connect to MongoDB!');
        logger.error(err);
    }
});
mongoose.connection.on('error', function (err) {
        logger.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);

// Init the express application

/**
 * Get port from environment and store in Express.
 */
app.set('port', config.port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(config.port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof config.port === 'string'
        ? 'Pipe ' + config.port
        : 'Port ' + config.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.fatal(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.fatal(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    logger.info('Listening on ' + bind)
}