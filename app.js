var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var fs = require('fs');

var telegram_server = require('./application/telegram/telegram_server');
var line_server = require('./application/line/app');
var facebook_server = require('./application/facebook/app');
var kaskus_server = require('./application/kaskus/kaskus_server');
var test_server = require('./application/test/app');

var imageDir = __dirname + "/images/";

app.use('/telegram', telegram_server);
app.use('/line', line_server);
app.use('/kaskus', kaskus_server);
app.use('/facebook', facebook_server);
app.use('/test', test_server);

//app.listen(8080);


var credentials = {
    //key: fs.readFileSync('cert/chatbot_uatmb_com-key.pem'),
    // cert: fs.readFileSync('cert/chatbot_uatmb_com-cert.pem')
};

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);
var httpsServer = https.createServer(app);


app.get("/images/:id", function(request, response) {
    var id = request.params.id;
    var path = imageDir + id;
    console.log("fetching image: ", path);
    response.sendFile(path);
});


httpServer.listen(80, function() {
    console.log("I'm working http:)");
});

httpsServer.listen(443, function() {
    console.log("I'm working https:)");
});
