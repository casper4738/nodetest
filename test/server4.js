function getHTML(url, next) {
  var unirest = require('unirest');

  unirest.post(url)
    .headers({
      'Content-Type': 'application/json'
    })
.field("user_id", "253762457")
.field("channel_type", "TELE")
.field("message", "saldo saya berapa?")
    .end(function(response) {
      console.log(response.body);
      var body = response.body;
      if (next) next(body);
    });


}


getHTML('https://jarvis.ombaq.com/chat', function(response) {
  console.log(response);
});
