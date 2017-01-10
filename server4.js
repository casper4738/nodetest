
function getHTML(url, next) {
  var unirest = require('unirest');
  
  unirest.get(url)
.headers({
        'Content-Type': 'application/json'
    })
    .end(function (response) {
      console.log(response.body);
	  var body = response.body;
      if (next) next(body);
    });


}

	
getHTML('http://10.20.201.191:8079/RestChatbank/api/getBalance?channelId=253762457&type=TELE', function(response) {
  console.log(response);
});
	