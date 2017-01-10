var URL_API = "https://api.line.me/v2/bot/message/push";
var TOKEN = "65iLNZCYIZf17pPNb47CPvkFQRS+rdaBq+QiM7BstpjVdDymfGobzhpCRbLvFb0ECeRs7Q/vO8xlXSKSfuPNz7tHm9txsSgMdn0qCUsVwNeIImtDN5PIPyXw4BtccrmBn4ksUacG9Y7H1HQZq6HVRwdB04t89/1O/w1cDnyilFU=";

var unirest = require('unirest'),
    util = require('util'),
    logger = require('../../util/logger');
var millisecondsToWait = 500,
    platformType = "LINE";

module.exports = {

    post(to, messages) {
        console.log("SEND MESSAGES ::: to -> " + to + " | messages -> " + messages);
        console.log("SEND MESSAGES ::: format text ->" + this.msg_format(to, messages));

        unirest.post(URL_API)
            .headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN,
            })
            .send(this.msg_format(to, messages))
            .end(function(response) {
                console.log(response.body);
            });
    },


    sendMessageText(recipientId, messageText) {
        var messageData = {
            to: recipientId,
            messages: [{
                "type": "text",
                "text": messageText
            }]
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + messageData);
        this.callSendAPI(messageData);
    },

    sendMessageWithButton(recipientId, messageText, messageValue) {
        var templateButtons = this.templateButtons("SEND : " + recipientId, messageText, messageValue)
        var messageData = {
            to: recipientId,
            messages: JSON.parse("[" + templateButtons + "]")
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + JSON.stringify(messageData));
        this.callSendAPI(messageData);
    },

    callSendAPI(messageData) {
        unirest.post(URL_API)
            .headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN,
            })
            .send(messageData)
            .end(function(response) {
                logger.debug(platformType, "Response callSendAPI ", response.body);
            });
    },

    sendMessageCarousel(recipientId, messageText) {
        var templateCarousel = this.templateCarousel("SEND : " + recipientId, messageText)
        var messageData = {
            to: recipientId,
            messages: JSON.parse("[" + templateCarousel + "]")
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + JSON.stringify(messageData));
        this.callSendAPI(messageData);
    },


    /* TEMPLATE READY ACTIONS */
    msg_reg: function() {
        return this.msg_type_templateButtons(
            "Registrasi",
            "https://s26.postimg.org/im8znmi4p/280061_ice_cream.jpg",
            "Selamat Datang",
            "Untuk memulai layanan silakan tekan tombol Registrasi.",
            this.formatActionMessage("Registrasi", "Registrasi")
        );
    },

    msg_reg_activation: function(list) {
        var list_phone = "";
        var jsonData = JSON.parse(list);
        for (var i = 0; i < jsonData.MSISDNList.length; i++) {
            var counter = jsonData.MSISDNList[i];
            var phone_number = "Aktivasi " + jsonData.MSISDNList[i].MSISDNData.MSISDN;
            list_phone = list_phone + this.formatActionMessage(phone_number, phone_number);

            if (i <= jsonData.MSISDNList.length - 1) {
                list_phone = list_phone + ",";
            }
        }

        return this.msg_type_templateButtons(
            "Registrasi",
            "https://s26.postimg.org/im8znmi4p/280061_ice_cream.jpg",
            "Registrasi",
            "Silakan pilih nomor untuk aktivasi layanan Chat Banking.",
            list_phone
        );
    },

    msg_reg_otp: function() {
        var buttons = ["Input OTP", "Kirim Ulang OTP", "Batal"];
        var list_act = this.convert_array_to_action(buttons);
        return this.msg_type_templateButtons_without_pict_title(
            "Registrasi",
            "null",
            "null",
            "Kamu akan menerima OTP ke 0812xxxx782. Silakan tekan tombol Input OTP. Untuk mengirim ulang OTP silakan tekan Kirim Ulang OTP.",
            list_act
        );
    },

    msg_buttons_without_pict_title: function(buttons, message) {
        var list_act = this.convert_array_to_action(buttons);
        return this.msg_type_templateButtons_without_pict_title(
            "null",
            "null",
            "null",
            message,
            list_act
        );
    },

    msg_confirm: function(buttons, message) {
        var list_act = this.convert_array_to_action(buttons);
        return this.templateConfirm(
            "null",
            message,
            list_act
        );
    },

    /* END OF TEMPLATE READY ACTIONS */


    /* TEMPLATE MESSAGE */
    templateButtons: function(altText, text, actions) {
        var messageData = JSON.stringify({
            type: "template",
            altText: altText,
            template: {
                type: "buttons",
                text: text,
                actions: JSON.parse("[" + actions + "]")
            }
        });

        return messageData;
    },
    
    templateButtonsWithImage: function(altText, thumbnailImageUrl, title, text, actions) {
        var messageData = JSON.stringify({
            type: "template",
            altText: altText,
            template: {
                type: "buttons",
                thumbnailImageUrl: thumbnailImageUrl,
                title: title,
                text: text,
                actions: JSON.parse("[" + actions + "]")
            }
        });

        return messageData;
    },
    
    templateConfirm: function(altText, text, actions) {
        var messageData = JSON.stringify({
            type: "template",
            altText: altText,
            template: {
                type: "confirm",
                text: text,
                actions: JSON.parse("[" + actions + "]")
            }
        });

        return messageData;
    },

    templateCarousel: function(altText, columns) {
        var messageData = JSON.stringify({
            type: "template",
            altText: altText,
            template: {
                type: "carousel",
                columns: JSON.parse("[" + columns + "]")
            }
        });

        return messageData;
    },

    formatCarouselButtons: function(text, actions) {
        var messageData = JSON.stringify({
            text: text,
            actions: JSON.parse("[" + actions + "]")
        });
        return messageData;
    },

    formatCarouselButtonsWithTitleAndImage: function(thumbnailImageUrl, title, text, actions) {
        var messageData = JSON.stringify({
            thumbnailImageUrl: thumbnailImageUrl,
            title: title,
            text: text,
            actions: JSON.parse("[" + actions + "]")
        });
        return messageData;
    },

    /* END OF TEMPLATE MESSAGE */


    /* TEMPLATE ACTION */

    formatActionPostback: function(label, data) {
        var message = JSON.stringify({
            type: "postback",
            label: label,
            data: data
        });
        return message;
    },

    formatActionMessage: function(label, text) {
        var message = JSON.stringify({
            type: "message",
            label: label,
            text: text
        });
        return message;
    },

    /* END OF TEMPLATE ACTION */

    /* PARSING ARRAY */
    convertArrayToAction: function(array) {
        var list_act = "";
        for (var i = 0; i < array.length; i++) {
            var temp = array[i];
            list_act = list_act + this.formatActionMessage(temp, temp);

            if (i === 0 && array.length > 1) {
                list_act = list_act + ",";
            }
            else if (i < array.length - 1) {
                list_act = list_act + ",";
            }
        }
        return list_act;
    },
    /* END OF PARSING ARRAY */

}
