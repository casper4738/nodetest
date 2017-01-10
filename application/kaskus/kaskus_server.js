var express = require('express');
var router = express.Router();


var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var jsonfile = require('jsonfile')

// middleware specific to this router
router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   console.log('ceeeeee');
//       console.log("LINE START");
//     console.log("check "+req+" - "+res);

  //PostCode("U3c5ac9f58f31eff7927737cceabfe87a");
  next();
});

// define the home page route
router.get('/kaskus', function(req, res) {
    res.send('KASKUS GET home page');
    //res.end("success");
    console.log("KASKUS GET home page");
    handleRequest(req, res); 
});

router.post('/', function(req, res) {
    res.send('KASKUS POST home page');
    //res.end("success");
    console.log("KASKUS POST home page");
    handleRequest(req, res); 
});

// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});


//Lets define a port we want to listen to
const PORT=8083; 
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
    
    console.log("KASKUS START");
    console.log("check "+request+" - "+response);
    
    try{
        
        console.log("check request");
        for(var data in request) {
            console.log("       data "+data);
        }
        
         console.log("check response");
        for(var data in response) {
            console.log("       data "+data);
        }
        
        

    }
    catch (e) {
      console.log("entering catch block");
      console.log(e);
      console.log("leaving catch block");
    }
    finally {
      console.log("entering and leaving the finally block");
      console.log("KASKUS FINISH");
    }



    response.end('LINE It Works!! Path Hit: ' + request.url);
}



//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

module.exports = router;