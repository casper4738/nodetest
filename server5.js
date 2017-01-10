var util = require("./application/facebook/template_message");
var service = require("./service/service");

function getFormatComma(loop_message, index, array, messages) {
  if (loop_message === -1) {}
  else if (index === array.length - 1) {}
  else if (loop_message === 0 && array.length > 1) {
    messages = messages + ",";
  }
  else if (loop_message < array.length - 1) {
    messages = messages + ",";
  }
  return messages;
}

function getHTML() {
  var list_phone = [];
  list_phone.push(util.convert_number_phone("1", "1x"));
  list_phone.push(util.convert_number_phone("2", "2x"));
  list_phone.push(util.convert_number_phone("3", "3x"));
  list_phone.push(util.convert_number_phone("4", "4x"));
  list_phone.push(util.convert_number_phone("5", "5x"));
  list_phone.push(util.convert_number_phone("6", "6x"));
  list_phone.push(util.convert_number_phone("7", "7x"));



  var buttons = "";
  var messages = "";
  var loop_buttons = 0;
  var loop_buttons_max = 3;
  var loop_message = -1;
  list_phone.forEach(function(element, index, array) {
    console.log(element);
    var value = JSON.parse(element);


    buttons = buttons + util.format_action_postback(value.MSISDNID, value.MSISDN);
    buttons = buttons + ",";



    loop_buttons++;

    if (loop_buttons === loop_buttons_max - 1) {
      loop_buttons = 0;
      console.log()
      console.log()
      console.log("xDATA ::: buttons " + buttons)
      console.log()

      buttons = buttons + util.format_action_postback("Batal", "Batal");

      messages = messages + util.format_button_message("Silakan pilih nomor handphone yang ingin diaktivasi untuk layanan Chat Banking.", buttons)
      buttons = "";
      console.log("xDATA ::: messages " + messages)
      console.log()
      console.log()
      loop_message++;

      messages = getFormatComma(loop_message, index, array, messages)


    }
    else if (index === array.length - 1) {
      console.log()
      console.log()
      console.log("xDATA ::: buttons last " + buttons)
      console.log()

      buttons = buttons + util.format_action_postback("Batal", "Batal");

      messages = messages + util.format_button_message("Silakan pilih nomor handphone yang ingin diaktivasi untuk layanan Chat Banking.", buttons)
      buttons = "";
      console.log("xDATA ::: messages last " + messages)
      console.log()
      console.log()
      loop_message++;

      messages = getFormatComma(loop_message, index, array, messages)

    }




  });


  messages = "[" + messages + "]"
  console.log()
  console.log()
  console.log()
  console.log()
  console.log("xDATA ::: messages final " + messages)


  var messageData = JSON.stringify({
    recipient: {
      id: "recipientId"
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: JSON.parse(messages)
        }
      }
    }
  });


  console.log()
  console.log()
  console.log("xDATA ::: messageData " + messageData)



};


function getParsing() {
  service.userRegistration("253762412", "FBMS", "6019001088888801", function(chunk) {
    console.log("xDATA ::: userRegistration -> " + chunk)



    //var chunk = response;
    // var chunk = {
    //   "code": "00",
    //   "msg": [
    //   "[{\"MSISDNData\":{\"MSISDNID\":\"38BFC41E19365FAEE05400144FFA2A45\",\"MSISDN\":\"0000XXXXXX02\"}},{\"MSISDNData\":{\"MSISDNID\":\"38BFC41E19375FAEE05400144FFA2A45\",\"MSISDN\":\"0000XXXXXX01\"}}]"
    //   ]
    // };


    console.log("xDATA ::: code -> " + chunk["code"])
    var list_phone = [];

    var resp = JSON.parse(chunk["msg"])
    console.log("xDATA ::: messageData " + resp.length)
    resp.forEach(function(element, index, array) {
      console.log(element);
      var MSISDNID = element.MSISDNData.MSISDNID;
      var MSISDN = element.MSISDNData.MSISDN;
      list_phone.push(util.convert_number_phone(MSISDNID, MSISDN));
    });

    list_phone.forEach(function(element, index, array) {
      console.log(element);
    });

    //  console.log("xDATA ::: messageData "+resp[1].MSISDNData.MSISDN)
    //var resp = JSON.parse(resp1).msg

    // console.log("xDATA ::: resp -> "+JSON.parse(resp).msg[1].MSISDNData.MSISDN)
    //console.log("xDATA ::: resp -> "+JSON.parse(resp).msg[1].MSISDNData.MSISDN)



  });


};


function printLogger() {
  var logger = require('./util/logger');


  var dateFormat = require('dateformat');
  var now = new Date();
  
 logger.verbose("CB-FBMS", "tes", "sssss");


  // //
  // // Any logger instance
  // //
  // logger.log('silly', "127.0.0.1 - there's no place like home");
  // logger.log('debug', "127.0.0.1 - there's no place like home");
  // logger.log('verbose', "127.0.0.1 - there's no place like home");
  // logger.log('info', "127.0.0.1 - there's no place like home");
  // logger.log('warn', "127.0.0.1 - there's no place like home");
  // logger.log('error', "127.0.0.1 - there's no place like home");
  // logger.info("127.0.0.1 - there's no place like home");
  // logger.warn("127.0.0.1 - there's no place like home");
  // logger.error("127.0.0.1 - there's no place like home");

  // //
  // // Default logger
  // //
  // logger.log('info', "127.0.0.1 - there's no place like home");
  // logger.info("127.0.0.1 - there's no place like home");

  // logger.log('silly', "tess");

  // logger.log('info', dateFormat(now, "dd-mm-yyyy"));

  // logger.level = 'debug';
  // logger.log('debug', 'Now my debug messages are written to console!');

  // logger.log('info', 'Hello distributed log files!');
  // logger.info('Hello again distributed logs');

  // logger.log('info', 'test message %s', 'my string');
  // // info: test message my string 

  // logger.log('info', 'test message %d', 123);
  // // info: test message 123 

  // logger.log('info', 'test message %j', {
  //   number: 123
  // }, {});
  // // info: test message {"number":123} 
  // // meta = {} 

  // logger.log('info', 'test message %s, %s', 'first', 'second', {
  //   number: 123
  // });
  // // info: test message first, second 
  // // meta = {number: 123} 

  // logger.log('info', 'test message', 'first', 'second', {
  //   number: 123
  // });
  // // info: test message first second 
  // // meta = {number: 123} 

  // logger.log('info', 'test message %s, %s', 'first', 'second', {
  //   number: 123
  // }, function() {});
  // // info: test message first, second 
  // // meta = {number: 123} 
  // // callback = function(){} 

  // logger.log('info', 'test message', 'first', 'second', {
  //   number: 123
  // }, function() {});
  // info: test message first second 
  // meta = {number: 123} 
  // callback = function(){} 
}

printLogger();
