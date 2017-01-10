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

//   PostCode("U3c5ac9f58f31eff7927737cceabfe87a");
  next();
});

// define the home page route
router.get('/telegram', function(req, res) {
  res.send('Telegram home pagexx');
});

// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});


//Lets define a port we want to listen to
const PORT=8082; 

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
                // data = data.split('&');
                // for (var i = 0; i < data.length; i++) {
                //     var _data = data[i].split("=");
                //     POST[_data[0]] = _data[1];
                // }
                //console.log(JSON.stringify(data));
                //console.log(JSON.stringify(POST));
               // var obj = JSON.parse(data);
               // var userId = obj.events[0].source.userId;
                
                console.log(data);
                
                //PostCode(userId);
                
                //console.log(JSON.stringify(data));
                //fs.writeFile('test.json', JSON.stringify(data, null, 2));
                
               // fs.writeFile('test.json', data);
                
                // var file = 'test.json';
                // var obj = data;
                 
                // jsonfile.writeFile(file, obj, function (err) {
                //   console.error(err)
                // })
                
                
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


function PostCode(user_id) {
    
  console.log("entering "+user_id);
      

    var body = JSON.stringify({
        "to": "U3c5ac9f58f31eff7927737cceabfe87a",
        "messages":[
            {
                "type":"text",
                "text":"Hello, world1"
            },
            {
                "type":"text",
                "text":"Hello, world2"
            }
        ]
    });
    
    
var options = {
    hostname: 'https://api.line.me/v2/bot/message/push',
      port: 80,
      method: 'POST',
      headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 65iLNZCYIZf17pPNb47CPvkFQRS+rdaBq+QiM7BstpjVdDymfGobzhpCRbLvFb0ECeRs7Q/vO8xlXSKSfuPNz7tHm9txsSgMdn0qCUsVwNeIImtDN5PIPyXw4BtccrmBn4ksUacG9Y7H1HQZq6HVRwdB04t89/1O/w1cDnyilFU='
          }
        };
        
    var req = http.request(options, function(res) {
      console.log('Status: ' + res.statusCode);
      console.log('Headers: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
     
    });
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    // write data to request body
    // req.write('{"string": result}');  ///RESULT HERE IS A JSON
    
    result = '{ "hello": "json" }';
    req.write('{"string": '+result+'}');
    
    req.end();
}


// //Create a server
// var server = http.createServer(handleRequest);

// //Lets start our server
// server.listen(PORT, function(){
//     //Callback triggered when server is successfully listening. Hurray!
//     console.log("Server listening on: http://localhost:%s", PORT);
// });




module.exports = router;