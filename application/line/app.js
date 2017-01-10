var express = require('express');
var router = express.Router();


var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var jsonfile = require('jsonfile')

var line_server = require('./line_server');

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    next();
});

router.post('/', function(req, res) {
    res.send('LINE POST home page');
    handleRequest(req, res);
});

// define the home page route
router.get('/', function(req, res) {
    res.send('LINE GET home page');
});

// define the about route
router.get('/about', function(req, res) {
        console.log("LINE GET home page");
    res.send('About birds');
});


//We need a function which handles requests and send response
function handleRequest(request, response) {

    console.log("LINE START");
    console.log("check " + request + " - " + response);

    try {
        console.log("check request");
        for (var data in request) {
            //console.log("       data "+data);
        }

        console.log("check response");
        for (var data in response) {
            //console.log("       data "+data);
        }

        // console.log(" chek data " + request.method);

        var POST = {};
        if (request.method === 'POST') {
            request.on('data', function(data) {
                data = data.toString();
                line_server.receivedMessage(data);
            })
        }


    }
    catch (e) {
        console.log("entering catch block");
        console.log(e);
        console.log("leaving catch block");
    }
    finally {
        console.log("entering and leaving the finally block");
        console.log("LINE FINISH");
    }

    response.end('LINE It Works!! Path Hit: ' + request.url);
}


module.exports = router;
