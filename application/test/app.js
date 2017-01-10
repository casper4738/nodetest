var express = require('express');
var router = express.Router();


var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var service = require("../../service/service.js");


// middleware specific to this router
router.use(function timeLog(req, res, next) {
  next();
});

// define the home page route
router.get('/test', function(req, res) {
    res.send('TEST GET home page');
    //res.end("success");
    console.log("LINE GET home page");
    //handleRequest(req, res); 
});

router.post('/', function(req, res) {
    res.send('TEST POST home page');
    //res.end("success");
    console.log("LINE POST home page");
    handleRequest(req, res); 
});

// define the about route
router.get('/about', function(req, res) {
  res.send('About test');
});


//Lets define a port we want to listen to
const PORT=8085; 
var flagMenu = -1;
var flagMain = [];


function isMenuChek(message, menu){
    return message.toLowerCase() === menu.toLowerCase();
}

function resetFlag(){
    flagMenu = 0;
    flagMain = 0;
}

//We need a function which handles requests and send response
function handleRequest(request, response){

    console.log("LINE START");
    console.log("check "+request+" - "+response);
    
    try {
        console.log("check request");
        for(var data in request) {
            //console.log("       data "+data);
        }
        
        console.log("check response");
        for(var data in response) {
            //console.log("       data "+data);
        }
        
        console.log(" chek data "+request.method);
        
        var POST = {};
        if (request.method == 'POST') {
            request.on('data', function(data) {
                data = data.toString();
                console.log(data);

                
                //service.get("253762457", "TELE", function(response) {
                //   console.log("xDATA ::: "+JSON.parse(response).msg);
                //});

                service.userRegistration("253762457", "TELE", "6019001088888801", function(response) {
                    console.log("xDATA ::: "+JSON.parse(response).msg);
                });

                
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