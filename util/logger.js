var winston = require('winston');
var dateFormat = require('dateformat');

var filename = "/../log/FBMSlog-" + dateFormat(new Date(), "yyyymmdd") + ".txt";

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            prettyPrint: true,
            json: false,
            timestamp: true,
            colorize: true,
            level: 'silly',
            stringify:true,
        }),
        new winston.transports.File({
            prettyPrint: true,
            filename: __dirname + filename,
            json: false,
            level: 'debug',
            stringify:true,
        })
    ],
    exceptionHandlers: [
        new(winston.transports.Console)({
            prettyPrint: true,
            json: false,
            timestamp: true,
            colorize: true,
            level: 'debug',
            stringify:true,
        }),
        new winston.transports.File({
            prettyPrint: true,
            filename: __dirname + filename,
            json: false,
            level: 'debug',
            stringify:true,
        })
    ],
    exitOnError: false
});

module.exports = logger;
