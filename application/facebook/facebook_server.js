'use strict';

var PATH = "../../";

var
  logger = require(PATH + "util/logger"),
  utility = require(PATH + "util/util"),
  service = require(PATH + "service/service"),
  errorMsg = require(PATH + "resources/error_messages"),
  stringMsg = require(PATH + "resources/string_message"),

  flagMap = require("./flagMap"),
  template = require("./template_message"),
  GLOBALS = require('./globals');

var util = require('util');


var platformType = "FBMS";

module.exports = {

  receivedMessage: function(event) {
    var messagingEvent = event;
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var messageText;


    logger.verbose("receivedMessage -> ", event);

    if (messagingEvent.message) {
      var timeOfMessage = event.timestamp;
      var message = event.message;

      var isEcho = message.is_echo;
      var messageId = message.mid;
      var appId = message.app_id;
      var metadata = message.metadata;

      messageText = message.text;

      logger.debug("Received message for user %d and page %d at %d with message:%s", senderID, recipientID, timeOfMessage, messageText);

      var messageAttachments = message.attachments;
      var quickReply = message.quick_reply;

      if (isEcho) {
        logger.debug("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
        return;
      }
      else if (quickReply) {
        var quickReplyPayload = quickReply.payload;
        logger.debug("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
      }
    }
    else if (messagingEvent.postback) {
      var timeOfPostback = event.timestamp;
      var payload = event.postback.payload;
      logger.debug("Received postback for user %d and page %d with payload '%s' " + "at %d", senderID, recipientID, payload, timeOfPostback);
      messageText = payload;
    }


    var channelId = senderID;

    if (messageText) {

      flagMap.setFlag(channelId, "channelId", channelId);
      flagMap.setFlag(channelId, "type", platformType);


      if (utility.isEquals(messageText, GLOBALS.GET_STARTED.LABEL)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.GET_STARTED.VALUE);
      }

      if (utility.isEquals(messageText, GLOBALS.MENU.INFO_DAN_PROMO.LABEL)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.MENU.INFO_DAN_PROMO.VALUE);
      }
      else if (utility.isEquals(messageText, GLOBALS.MENU.TRANSAKSI_PERBANKAN.LABEL)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.MENU.TRANSAKSI_PERBANKAN.VALUE);
      }


      //REGISTRASI
      else if (utility.isEquals(messageText, GLOBALS.MENU.REGISTRASI.LABEL)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.MENU.REGISTRASI.VALUE);
      }
      else if (utility.isEquals(messageText, GLOBALS.MENU.REQUIRED_REGISTRATION.LABEL)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.MENU.REQUIRED_REGISTRATION.VALUE);
      }

      //ADMINISTRASI
      else if (utility.isEquals(messageText, GLOBALS.MENU.ADMINISTRASI.LABEL)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.MENU.ADMINISTRASI.VALUE);
      }
      else if (utility.isEquals(messageText, GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.LABEL) && utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.MENU.ADMINISTRASI.VALUE)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.VALUE);
      }
      else if (utility.isEquals(messageText, GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.YA.LABEL) && utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.VALUE)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.YA.VALUE);
      }
      else if (utility.isEquals(messageText, GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.TIDAK.LABEL) && utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.VALUE)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.TIDAK.VALUE);
      }
      else if (utility.isEquals(messageText, GLOBALS.ADMINISTRASI.REG_INFO_KK.LABEL) && utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.MENU.ADMINISTRASI.VALUE)) {
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.ADMINISTRASI.REG_INFO_KK.VALUE);
      }


      else if (utility.isEquals(messageText, "menu")) {
        flagMap.setFlag(channelId, "flagMenu", 999);
      }


      logger.info("channelId->" + channelId, "| messageText->" + messageText, "| flagMenu->" + flagMap.getFlag(channelId, "flagMenu"));
      /*
      ==============================================
      GET_STARTED
      ==============================================
      */
      if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.GET_STARTED.VALUE)) {
        var button = ["Info dan Promo", "Transaksi Perbankan"];
        var messageValue = template.convertArrayToAction(button);
        var messageText = stringMsg.BELUM_REG;
        template.sendMessageButton(senderID, messageText, messageValue);
      }
      /* END OF GET_STARTED */

      /*
      ==============================================
      REGISTRASI
      ==============================================
      */

      /* REQUIRED_REGISTRATION */
      if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.MENU.REQUIRED_REGISTRATION.VALUE)) {
        var button = ["Registrasi", "Ketentuan-ketentuan"];
        var messageValue = template.convertArrayToAction(button);
        var messageText = stringMsg.BELUM_REG;
        template.sendMessageButton(objChannelId, messageText, messageValue);
      }
      /* END OF REQUIRED_REGISTRATION */

      /* REGISTRASI */
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.MENU.REGISTRASI.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var objType = flagMap.getFlag(objChannelId, "type");

        service.checkStatusUser(objChannelId, objType, function(response) {
          logger.info("response->" + response)
          response = JSON.stringify(response);
          var resp = JSON.parse(response);

          if (resp.code === "00") {
            if (resp.msg === "AKT") {
              template.sendMessageText(objChannelId, errorMsg.CB_AKTIF)
            }
            else if (resp.msg === "BLK") {
              template.sendMessageText(objChannelId, errorMsg.CB_BLOKIR)
            }
            else {
              flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.REGISTRASI.STEP_1);

              var button = ["Batal"];
              var messageValue = template.convertArrayToAction(button);
              var messageText = stringMsg.INPUT_KARTU_ATM;
              template.sendMessageButton(objChannelId, messageText, messageValue);
            }
          }
        });
      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.REGISTRASI.STEP_1)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var objType = flagMap.getFlag(objChannelId, "type");


        flagMap.setFlag(objChannelId, "cardNo", messageText);
        var objCardNo = flagMap.getFlag(objChannelId, "cardNo");

        if (utility.isFormatNumberATMCard(objCardNo)) {
          service.userRegistration(objChannelId, objType, objCardNo, function(response) {
            logger.info("response->" + response)
            response = JSON.stringify(response);
            var resp = JSON.parse(response);

            if (resp.code === "00") {
              flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.REGISTRASI.STEP_2);

              var list_phone = [];
              var msg = JSON.parse(JSON.stringify(resp.msg))

              msg.forEach(function(element, index, array) {
                logger.info("userRegistration:::", "msg->" + element)
                var MSISDNID = element.MSISDNData.MSISDNID;
                var MSISDN = element.MSISDNData.MSISDN;
                list_phone.push(utility.convert_number_phone("#" + MSISDNID + "#" + MSISDN, MSISDN));
              });

              var buttons = "";
              var messages = "";
              var loop_buttons = 0;
              var loop_buttons_max = 3;
              var loop_message = -1;
              list_phone.forEach(function(element, index, array) {
                var value = JSON.parse(element);

                buttons = buttons + template.format_action_postback(value.MSISDN, value.MSISDNID);
                buttons = buttons + ",";

                loop_buttons++;

                if (loop_buttons === loop_buttons_max - 1) {
                  loop_buttons = 0;
                  buttons = buttons + template.format_action_postback("Batal", "Batal");
                  messages = messages + template.format_button_message(stringMsg.CHOOSE_NUMBER_PHONE, buttons)
                  buttons = "";
                  loop_message++;
                  messages = utility.getFormatComma(loop_message, index, array, messages)
                }
                else if (index === array.length - 1) {
                  buttons = buttons + template.format_action_postback("Batal", "Batal");
                  messages = messages + template.format_button_message(stringMsg.CHOOSE_NUMBER_PHONE, buttons)
                  buttons = "";
                  loop_message++;
                  messages = utility.getFormatComma(loop_message, index, array, messages)
                }

              });

              template.sendGenericMessageWithQuickMenu(objChannelId, messages);
            }
            else {
              var msg = resp.msg
              template.sendMessageText(objChannelId, msg)

              flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.REGISTRASI.STEP_1);
              var button = ["Batal"];
              var messageValue = template.convertArrayToAction(button);
              var messageText = stringMsg.INPUT_KARTU_ATM;
              template.sendMessageButton(objChannelId, messageText, messageValue);
            }
          });
        }
        else {
          template.sendMessageText(objChannelId, errorMsg.INPUT_KARTU_ATM)

          flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.REGISTRASI.STEP_1);
          var button = ["Batal"];
          var messageValue = template.convertArrayToAction(button);
          var messageText = stringMsg.INPUT_KARTU_ATM;
          template.sendMessageButton(objChannelId, messageText, messageValue);
        }
      }

      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.REGISTRASI.STEP_2)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var objType = flagMap.getFlag(channelId, "type");

        flagMap.setFlag(channelId, "phoneNumber", messageText);
        var objPhoneNumber = flagMap.getFlag(objChannelId, "phoneNumber");
        if (utility.isFormatNumberPhone(objPhoneNumber)) {
          //--------------------------------------------------------------------
          var MSISDNID = objPhoneNumber.split("#")[1]
          var MSISDN = objPhoneNumber.split("#")[2]
          service.sendOTP(objChannelId, objType, MSISDNID, function(response) {
            logger.info("response->" + response)
            response = JSON.stringify(response);
            var resp = JSON.parse(response);

            if (resp.code === "00") {
              flagMap.setFlag(channelId, "flagMenu", GLOBALS.REGISTRASI.STEP_3);
              var button = ["Input OTP", "Kirim Ulang OTP", "Batal"];
              var messageValue = template.convertArrayToAction(button);
              var messageText = stringMsg.SEND_OTP.replace("[MSISDN]", MSISDN);
              template.sendMessageButton(objChannelId, messageText, messageValue);
            }
            else {
              var msg = resp.msg
              template.sendMessageText(objChannelId, msg)
            }

          });
          //--------------------------------------------------------------------
        }
        else {
          template.sendMessageText(objChannelId, errorMsg.INPUT_NOMOR_HANDPHONE)
        }
      }

      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.REGISTRASI.STEP_3)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var objType = flagMap.getFlag(channelId, "type");

        flagMap.setFlag(channelId, "tombolOTP", messageText);
        var objTombolOTP = flagMap.getFlag(channelId, "tombolOTP");

        if (objTombolOTP === "Input OTP") {
          //--------------------------------------------------------------------
          flagMap.setFlag(channelId, "flagMenu", GLOBALS.REGISTRASI.STEP_4);
          var button = ["Batal"];
          var messageValue = template.convertArrayToAction(button);
          var messageText = stringMsg.INPUT_OTP;
          template.sendMessageButton(objChannelId, messageText, messageValue);
          //--------------------------------------------------------------------
        }
        else if (objTombolOTP === "Kirim Ulang OTP") {
          //--------------------------------------------------------------------
          flagMap.setFlag(channelId, "flagMenu", GLOBALS.REGISTRASI.STEP_3);

          var objPhoneNumber = flagMap.getFlag(objChannelId, "phoneNumber");
          var MSISDNID = objPhoneNumber.split("#")[1]
          var MSISDN = objPhoneNumber.split("#")[2]

          service.sendOTP(objChannelId, objType, MSISDNID, function(response) {
            logger.info("response->" + response)
            response = JSON.stringify(response);
            var resp = JSON.parse(response);

            if (resp.code === "00") {
              flagMap.setFlag(channelId, "flagMenu", GLOBALS.REGISTRASI.STEP_3);
              var button = ["Input OTP", "Kirim Ulang OTP", "Batal"];
              var messageValue = template.convertArrayToAction(button);
              var messageText = stringMsg.SEND_OTP.replace("[MSISDN]", MSISDN);
              template.sendMessageButton(objChannelId, messageText, messageValue);
            }
            else {
              var msg = resp.msg
              template.sendMessageText(objChannelId, msg)
            }
          });
          //--------------------------------------------------------------------
        }
        else if (objTombolOTP === "Batal") {
          flagMap.setFlag(channelId, "flagMenu", GLOBALS.NULL);
        }

      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.REGISTRASI.STEP_4)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var objType = flagMap.getFlag(channelId, "type");

        flagMap.setFlag(objChannelId, "OTP", messageText);
        var objOTP = flagMap.getFlag(objChannelId, "OTP");

        if (utility.isFormatOneTimePassword(objOTP)) {
          service.authOTP(objChannelId, objType, objOTP, function(response) {
            logger.info("response->" + response)
            response = JSON.stringify(response);
            var resp = JSON.parse(response);

            if (resp.code === "00") {
              flagMap.setFlag(channelId, "flagMenu", GLOBALS.NULL);
              var objChannelId = flagMap.getFlag(channelId, "channelId");
              template.sendMessageTextWithQuickMenu(objChannelId, stringMsg.SUCCESS_REGISTRATION, stringMsg._menu);
            }
            else {
              var msg = resp.msg
              template.sendMessageText(objChannelId, msg)
            }
          });
        }
        else {
          template.sendMessageText(objChannelId, errorMsg.INPUT_OTP)
        }

      }
      /* END OF REGISTRASI */

      /*
      ==============================================
      ADMINISTRASI
      ==============================================
      */
      if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.MENU.ADMINISTRASI.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");

        var button = ["Reg Info KK", "Hapus Reg Info KK", "Tutup Layanan"];
        var myMessage = template.convertArrayToAction(button);
        template.sendMessageButton(objChannelId, stringMsg.MENU, myMessage);
      }
      //REG_INFO_KK
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.REG_INFO_KK.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var button = ["Batal"];
        var messageValue = template.convertArrayToAction(button);
        var messageText = stringMsg.INPUT_KK;
        template.sendMessageButton(objChannelId, messageText, messageValue);
        
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.ADMINISTRASI.REG_INFO_KK.STEP.STEP_1);
      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.REG_INFO_KK.STEP.STEP_1.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var button = ["Batal"];


        flagMap.setFlag(channelId, "creditCardNumber", messageText);
        var objCreditCardNumber = flagMap.getFlag(objChannelId, "creditCardNumber");
        if (utility.isFormatNumberCreditCard(objCreditCardNumber)) {
          //--------------------------------------------------------------------
          service.sendOTP(objChannelId, objType, objCreditCardNumber, function(response) {
            logger.info("response->" + response)
            response = JSON.stringify(response);
            var resp = JSON.parse(response);

            if (resp.code === "00") {
              flagMap.setFlag(channelId, "flagMenu", GLOBALS.REGISTRASI.STEP_3);
              var messageText = stringMsg.REG_INFO_KK;
              template.sendMessageTextWithQuickMenu(objChannelId, messageText, stringMsg._menu);
            }
            else {
              var msg = resp.msg
              template.sendMessageText(objChannelId, msg)
            }
          });
          //--------------------------------------------------------------------
        }
        else {
          template.sendMessageText(objChannelId, errorMsg.INPUT_KARTU_KREDIT)
          
          var button = ["Batal"];
          var messageValue = template.convertArrayToAction(button);
          var messageText = stringMsg.INPUT_KK;
          template.sendMessageButton(objChannelId, messageText, messageValue);
        }

      }
      
      //HAPUS_REG_INFO_KK
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.HAPUS_REG_INFO_KK.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var button = ["Batal"];
        var messageValue = template.convertArrayToAction(button);
        var messageText = stringMsg.INPUT_KK;
        template.sendMessageButton(objChannelId, messageText, messageValue);
        
        flagMap.setFlag(channelId, "flagMenu", GLOBALS.ADMINISTRASI.HAPUS_REG_INFO_KK.STEP.STEP_1);
      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.HAPUS_REG_INFO_KK.STEP.STEP_1.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var button = ["Batal"];


        flagMap.setFlag(channelId, "creditCardNumber", messageText);
        var objCreditCardNumber = flagMap.getFlag(objChannelId, "creditCardNumber");
        if (utility.isFormatNumberCreditCard(objCreditCardNumber)) {
          //--------------------------------------------------------------------
          service.sendOTP(objChannelId, objType, objCreditCardNumber, function(response) {
            logger.info("response->" + response)
            response = JSON.stringify(response);
            var resp = JSON.parse(response);

            if (resp.code === "00") {
              flagMap.setFlag(channelId, "flagMenu", GLOBALS.REGISTRASI.STEP_3);
              var messageText = stringMsg.HAPUS_REG_INFO_KK;
              template.sendMessageTextWithQuickMenu(objChannelId, messageText, stringMsg._menu);
            }
            else {
              var msg = resp.msg
              template.sendMessageText(objChannelId, msg)
            }
          });
          //--------------------------------------------------------------------
        }
        else {
          template.sendMessageText(objChannelId, errorMsg.INPUT_KARTU_KREDIT)
          
          var button = ["Batal"];
          var messageValue = template.convertArrayToAction(button);
          var messageText = stringMsg.INPUT_KK;
          template.sendMessageButton(objChannelId, messageText, messageValue);
        }

      }
      
      //TUTUP_LAYANAN
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");

        var button = ["Ya", "Tidak"];
        var myMessage = template.convertArrayToAction(button);
        template.sendMessageButton(objChannelId, stringMsg.TUTUP_LAYANAN, myMessage);
      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.YA.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");

        var msg = stringMsg.TUTUP_LAYANAN_YA
        template.sendMessageText(objChannelId, msg)

        var button = ["Registrasi", "Ketentuan-ketentuan"];
        var myMessage = template.convertArrayToAction(button);
        template.sendMessageButton(objChannelId, stringMsg.REG_ULANG, myMessage);

        flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.NULL);
      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.TIDAK.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var messageText = stringMsg.TUTUP_LAYANAN_TDK
        template.sendMessageTextWithQuickMenu(objChannelId, messageText, stringMsg._menu);
        flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.NULL);
      }
      /* END OF ADMINISTRASI */


      /*
      ==============================================
      MENU
      ==============================================
      */
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), 999)) {
        var menu = [
          "Cek Saldo",
          "Cek Mutasi Rekening",
          "Isi Pulsa",
          "Info Kartu Kredit",
          "Administrasi",
          "Cara Pakai"
        ];

        var list_menu = [];

        menu.forEach(function(element, index, array) {
          var title = element;
          var payload = element;
          list_menu.push(template.convert_button_action(title, payload));
        });

        var buttons = "";
        var messages = "";
        var loop_buttons = 0;
        var loop_buttons_max = 3;
        var loop_message = -1;
        list_menu.forEach(function(element, index, array) {
          var value = JSON.parse(element);

          buttons = buttons + template.format_action_postback(value.title, value.payload);
          buttons = buttons + ",";

          loop_buttons++;

          if (loop_buttons === loop_buttons_max) {
            loop_buttons = 0;
            messages = messages + template.format_button_message("Silakan pilih transaksi yang kamu inginkan.", buttons)
            buttons = "";
            loop_message++;
            messages = template.getFormatComma(loop_message, index, array, messages)
          }
          else if (index === array.length) {
            messages = messages + template.format_button_message("Silakan pilih transaksi yang kamu inginkan.", buttons)
            buttons = "";
            loop_message++;
            messages = template.getFormatComma(loop_message, index, array, messages)
          }

        });

        template.sendMessageCarousel(senderID, messages);
      }
      /* END OF MENU*/



      /*
      ==============================================
      INFO DAN PROMO
      ==============================================
      */

      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.MENU.INFO_DAN_PROMO.VALUE)) {
        var button = ["Hot Promo", "Latest Promo", "Lihat Kategori"];
        var buttons = template.formatActionPostback("Anggur", "Anggur");


        var message = template.convert_array_elements_generic_template(buttons);
        console.log("xDATA ::: " + message);
        console.log("xDATA :::title  " + JSON.parse(message).title);
        template.sendGenericMessageWithQuickMenu(senderID, message);
      }

      else if (messageAttachments) {
        template.sendTextMessage(senderID, "Message with attachment received");
      }
    }
  },


  sendMenuMessage: function(senderID) {
    var message = "Silakan pilih Menu";
    template.sendMainMenu(senderID, message, stringMsg._menu);
  }

}
