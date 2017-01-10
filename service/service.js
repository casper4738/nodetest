var unirest = require('unirest');
var REST_ADDR = "http://10.20.201.191:8079/RestChatbank/api/";



module.exports = {

  header: function(Request) {
    Request.maxRedirects(6)
    Request.timeout(1000)
    Request.encoding('utf-8')
    Request.strictSSL(true)
  },

  /*1.  Get Balance*/
  getBalance: function(channelId, type, resp) {
    unirest.get(REST_ADDR + "/getBalance?channelId=" + channelId + "&type=" + type)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*2.  Get Mutasi*/
  getMutasi: function(channelId, type, accNo, resp) {
    unirest.get(REST_ADDR + "/getMutasi?channelId=" + channelId + "&type=" + type + "&accNo=" + accNo)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*3.  Get Kurs*/
  getKurs: function(channelId, type, kurs, resp) {
    unirest.get(REST_ADDR + "/getKurs?channelId=" + channelId + "&type=" + type + "&kurs=" + kurs)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*4.  Get Deposito*/
  getDeposito: function(channelId, type, bilyet, resp) {
    unirest.get(REST_ADDR + "/getDeposito?channelId=" + channelId + "&type=" + type + "&bilyet=" + bilyet)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*5.  Get Limit Credit Card*/
  getUserid: function(channelId, type, cardNo, resp) {
    unirest.get(REST_ADDR + "/getUserid?channelId=" + channelId + "&type=" + type + "&cardNo=" + cardNo)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*6.  Get Credit Card Billing*/
  getCCBill: function(channelId, type, cardNo, resp) {
    unirest.get(REST_ADDR + "/getCCBill?channelId=" + channelId + "&type=" + type + "&cardNo=" + cardNo)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*7.  Get Credit Card Transaction List*/
  getCCTrx: function(channelId, type, cardNo, resp) {
    unirest.get(REST_ADDR + "/getCCTrx?channelId=" + channelId + "&type=" + type + "&cardNo=" + cardNo)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*7.  Get Credit Card Transaction List*/
  getCCTrx: function(channelId, type, cardNo, resp) {
    unirest.get(REST_ADDR + "/getCCTrx?channelId=" + channelId + "&type=" + type + "&cardNo=" + cardNo)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*8.  Get Phone Credit Nominal*/
  getPhoneNominal: function(channelId, type, cardNo, resp) {
    unirest.get(REST_ADDR + "/getPhoneNominal?channelId=" + channelId + "&type=" + type + "&cardNo=" + cardNo)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*9.  Get SMS Top Up (under dev)*/
  getTopup: function(channelId, type, cardNo, resp) {
    unirest.get(REST_ADDR + "/getTopup?channelId=" + channelId + "&type=" + type + "&cardNo=" + cardNo)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*10. Get List Phone Number*/
  getPhoneList: function(channelId, type, cardNo, resp) {
    unirest.get(REST_ADDR + "/getPhoneList?channelId=" + channelId + "&type=" + type + "&cardNo=" + cardNo)
      .headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        var body = JSON.stringify(response.body);
        console.log(body);
        if (resp) resp(body);
      });
  },

  /*11.1. Input Card Number (return list handphone numbers)*/
  userRegistration: function(channelId, type, cardNo, resp) {
    var Request = unirest.get(REST_ADDR + "/userRegistration?channelId=" + channelId + "&type=" + type + "&cardNo=" + cardNo);
    this.header(Request);
    Request.headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        response = {
          "code": "00",
          "msg": [{
            "MSISDNData": {
              "MSISDNID": "38BFC41E19365FAEE05400144FFA2A45",
              "MSISDN": "0000XXXXXX02"
            }
          }, {
            "MSISDNData": {
              "MSISDNID": "38BFC41E19375FAEE05400144FFA2A45",
              "MSISDN": "0000XXXXXX01"
            }
          }]
        };

        // response = {
        //   "code": "01",
        //   "msg": "ERROR"
        // }

        if (resp) resp(response);
      });
  },

  /*11.2. Select phone number (return OTP)*/
  sendOTP: function(channelId, type, input, resp) {
    var Request = unirest.get(REST_ADDR + "/sendOTP?channelId=" + channelId + "&type=" + type + "&input=" + input)
    this.header(Request)
    Request.headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        response = {
          "code": "00",
          "msg": [
            "Send OTP Success"
          ]
        }
        if (resp) resp(response);
      });
  },

  /*11.3. Authenticate OTP*/
  authOTP: function(channelId, type, input, resp) {
    var Request = unirest.get(REST_ADDR + "/authOTP?channelId=" + channelId + "&type=" + type + "&input=" + input)
    this.header(Request)
    Request.headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        response = {
          "code": "00",
          "msg": ["SUCCESS"]
        }
        if (resp) resp(response);
      });
  },


  /*12.  checkStatusUser */
  checkStatusUser: function(channelId, type, resp) {
    var Request = unirest.get(REST_ADDR + "/checkStatusUser?channelId=" + channelId + "&type=" + type);
    this.header(Request);
    Request.headers({
        'Accept': 'application/json'
      })
      .end(function(response) {
        response = {
          "code": "00",
          "msg": "REG"
        };

        if (resp) resp(response);

      });
  },


  sendNLP: function(user_id, channel_type, messageText, resp) {
    unirest.post("https://jarvis.ombaq.com/chat")
      .headers({
        'Content-Type': 'multipart/form-data'
      })
      .field("user_id", "253762457")
      .field("channel_type", "TELE")
      .field("message", messageText)
      .end(function(response) {
        console.log(response.body);
        var body = response.body;
        if (resp) resp(body);
      });
  },

  sendNews: function(message, resp) {
    unirest.post("https://buzz-newsbot.ombaq.com/bca/facebook")
      .headers({
        'Content-Type': 'application/json'
      })
      .send(message)
      .end(function(response) {
        console.log(response.body);
        var body = response.body;
        if (resp) resp(body);
      });
  },



  /*
    getBalance("253762457", "TELE", function(response) {
      console.log(response);
    });
    */

}
