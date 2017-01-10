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

var platformType = "LINE";

module.exports = {

  receivedMessage: function(data) {
    console.log(data);

    var event = JSON.parse(data);
    var userId = event.events[0].source.userId;
    var messageText = event.events[0].message.text;

    var channelId = userId;

    if (messageText) {

      flagMap.setFlag(channelId, "channelId", channelId);
      flagMap.setFlag(channelId, "type", platformType);


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


      logger.info("channelId->" + channelId, "| messageText->" + messageText, "| flagMenu->" + flagMap.getFlag(channelId, "flagMenu"));


      /*
      ==============================================
      REGISTRASI
      ==============================================
      */

      /* REQUIRED_REGISTRATION */
      if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.MENU.REQUIRED_REGISTRATION.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");
        var button = ["Registrasi", "Ketentuan-ketentuan"];
        var myMessage = template.convertArrayToAction(button);
        template.sendMessageWithButton(objChannelId, stringMsg.BELUM_REG, myMessage);
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
              var messageText = errorMsg.CB_AKTIF;
              template.sendMessageText(objChannelId, messageText)
            }
            else if (resp.msg === "BLK") {
              var messageText = errorMsg.CB_BLOKIR;
              template.sendMessageText(objChannelId, messageText)
            }
            else {
              flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.REGISTRASI.STEP_1);

              var button = ["Batal"];
              var messageValue = template.convertArrayToAction(button);
              var messageText = stringMsg.INPUT_KARTU_ATM;
              template.sendMessageWithButton(objChannelId, messageText, messageValue);
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

                buttons = buttons + template.formatActionPostback(value.MSISDN, value.MSISDNID);
                buttons = buttons + ",";

                loop_buttons++;

                if (loop_buttons === loop_buttons_max - 1) {
                  loop_buttons = 0;
                  buttons = buttons + template.formatActionPostback("Batal", "Batal");
                  messages = messages + template.formatCarouselButtons(stringMsg.CHOOSE_NUMBER_PHONE, buttons)
                  buttons = "";
                  loop_message++;
                  messages = utility.getFormatComma(loop_message, index, array, messages)
                }
                else if (index === array.length - 1) {
                  buttons = buttons + template.formatActionPostback("Batal", "Batal");
                  messages = messages + template.formatCarouselButtons(stringMsg.CHOOSE_NUMBER_PHONE, buttons)
                  buttons = "";
                  loop_message++;
                  messages = utility.getFormatComma(loop_message, index, array, messages)
                }

              });

              template.sendMessageCarousel(objChannelId, messages);
            }
            else {
              var msg = JSON.parse(JSON.stringify(resp.msg))
              template.sendMessageText(objChannelId, msg)

              flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.REGISTRASI.STEP_1);
              var button = ["Batal"];
              var messageValue = template.convertArrayToAction(button);
              var messageText = stringMsg.INPUT_KARTU_ATM;
              template.sendMessageWithButton(objChannelId, messageText, messageValue);
            }
          });
        }
        else {
          template.sendMessageText(objChannelId, errorMsg.INPUT_KARTU_ATM)

          flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.REGISTRASI.STEP_1);
          var button = ["Batal"];
          var messageValue = template.convertArrayToAction(button);
          var messageText = stringMsg.INPUT_KARTU_ATM;
          template.sendMessageWithButton(objChannelId, messageText, messageValue);
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
              template.sendMessageWithButton(objChannelId, messageText, messageValue);
            }
            else {
              var msg = JSON.parse(JSON.stringify(resp.msg))
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
          template.sendMessageWithButton(objChannelId, messageText, messageValue);
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
              template.sendMessageWithButton(objChannelId, messageText, messageValue);
            }
            else {
              var msg = JSON.parse(JSON.stringify(resp.msg))
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
              template.sendMessageText(objChannelId, stringMsg.SUCCESS_REGISTRATION);
            }
            else {
              var msg = JSON.parse(JSON.stringify(resp.msg))
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
        template.sendMessageWithButton(objChannelId, stringMsg.MENU, myMessage);
      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");

        var button = ["Ya", "Tidak"];
        var myMessage = template.convertArrayToAction(button);
        template.sendMessageWithButton(objChannelId, stringMsg.TUTUP_LAYANAN, myMessage);
      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.YA.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");

        var msg = stringMsg.TUTUP_LAYANAN_YA
        template.sendMessageText(objChannelId, msg)

        var button = ["Registrasi", "Ketentuan-ketentuan"];
        var myMessage = template.convertArrayToAction(button);
        template.sendMessageWithButton(objChannelId, stringMsg.REG_ULANG, myMessage);

        flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.NULL);
      }
      else if (utility.isCheckFlagMenu(flagMap.getFlag(channelId, "flagMenu"), GLOBALS.ADMINISTRASI.TUTUP_LAYANAN.TIDAK.VALUE)) {
        var objChannelId = flagMap.getFlag(channelId, "channelId");

        var msg = stringMsg.TUTUP_LAYANAN_TDK
        template.sendMessageText(objChannelId, msg)
        template.sendMessageText(objChannelId, stringMsg.MENU);

        flagMap.setFlag(objChannelId, "flagMenu", GLOBALS.NULL);
      }
      /* END OF ADMINISTRASI */


    }
  }

}
