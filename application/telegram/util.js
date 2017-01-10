var URL_API = "https://api.line.me/v2/bot/message/push";
var TOKEN = "65iLNZCYIZf17pPNb47CPvkFQRS+rdaBq+QiM7BstpjVdDymfGobzhpCRbLvFb0ECeRs7Q/vO8xlXSKSfuPNz7tHm9txsSgMdn0qCUsVwNeIImtDN5PIPyXw4BtccrmBn4ksUacG9Y7H1HQZq6HVRwdB04t89/1O/w1cDnyilFU=";

var unirest = require('unirest');

function post() {
    unirest.post(URL_API)
    .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+TOKEN,
    })
    .send(
        
        {
            "to": "U3c5ac9f58f31eff7927737cceabfe87a",
            "messages":[
                {
                    "type":"text",
                    "text":"Hello, world22221"
                }
            ]
        }


        )
    .end(function (response) {
      console.log(response.body);
    });
}