var unirest = require('unirest');
var logger = require('../../util/logger');

const
    config = require('config'),
    request = require('request'),
    util = require('util');

var millisecondsToWait = 500;

var URL_API = "https://graph.facebook.com/v2.6/me/messages";

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
    (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
    config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and 
// assets located at this address. 
const SERVER_URL = (process.env.SERVER_URL) ?
    (process.env.SERVER_URL) :
    config.get('serverURL');

module.exports = {

    sendMainMenu(recipientId, messageText, messageValue) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText,
                quick_replies: messageValue
            }
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + messageData);
        this.callSendAPI(messageData);
    },

    sendMessageText(recipientId, messageText) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText,
                metadata: messageText
            }
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + messageData);
        this.callSendAPI(messageData);
    },

    sendMessageButton(recipientId, messageText, messageValue) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: messageText,
                        buttons: "[" + messageValue + "]"
                    }
                }
            }
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + messageData);
        this.callSendAPI(messageData);
    },

    sendMessageButtonWithQuickMenu(recipientId, messageText, messageValue, quickMenu) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: messageText,
                        buttons: "[" + messageValue + "]"
                    }
                },
                quick_replies: quickMenu
            }
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + messageData);
        this.callSendAPI(messageData);
    },

    sendMessageTextWithQuickMenu(recipientId, messageValue, quickMenu) {
        var messageData = {
            recipient: {
                id: recipientId
            },

            message: {
                text: messageValue,
                quick_replies: quickMenu
            }
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + messageData);
        this.callSendAPI(messageData);
    },

    sendMessageCarousel(recipientId, messageValue) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: "[" + messageValue + "]"
                    }
                }
            }
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + messageData);
        this.callSendAPI(messageData);
    },
    

    sendMessageCarouselWithQuickMenu(recipientId, messageValue, quickMenu) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: "[" + messageValue + "]"
                    }
                },
                quick_replies: quickMenu
            }
        };

        logger.debug("Sent Message", "recipientId->" + recipientId, "| messageData->" + messageData);
        this.callSendAPI(messageData);
    },



    /*
     * Send a message with Quick Reply buttons.
     *
     */
    sendQuickReply: function(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                "text": "Pick a color:",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Red",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                }, {
                    "content_type": "text",
                    "title": "Green",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                }]
            }
        };
        this.callSendAPI(messageData);
    },


    /*
     * Send an image using the Send API.
     *
     */
    sendImageMessage: function(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: SERVER_URL + "/assets/rift.png"
                    }
                }
            }
        };

        this.callSendAPI(messageData);
    },

    /*
     * Send a Gif using the Send API.
     *
     */
    sendGifMessage: function(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: SERVER_URL + "/assets/instagram_logo.gif"
                    }
                }
            }
        };

        this.callSendAPI(messageData);
    },

    /*
     * Send audio using the Send API.
     *
     */
    sendAudioMessage: function(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "audio",
                    payload: {
                        url: SERVER_URL + "/assets/sample.mp3"
                    }
                }
            }
        };

        this.callSendAPI(messageData);
    },

    /*
     * Send a video using the Send API.
     *
     */
    sendVideoMessage: function(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "video",
                    payload: {
                        url: SERVER_URL + "/assets/allofus480.mov"
                    }
                }
            }
        };

        this.callSendAPI(messageData);
    },

    /*
     * Send a file using the Send API.
     *
     */
    sendFileMessage: function(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "file",
                    payload: {
                        url: SERVER_URL + "/assets/test.txt"
                    }
                }
            }
        };

        this.callSendAPI(messageData);
    },

    /*
     * Send a receipt message using the Send API.
     *
     */
    sendReceiptMessage: function(recipientId, but) {
        // Generate a random receipt ID as the API requires a unique ID
        var receiptId = "order" + Math.floor(Math.random() * 1000);

        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "receipt",
                        recipient_name: "Peter Chang",
                        order_number: receiptId,
                        currency: "USD",
                        payment_method: "Visa 1234",
                        timestamp: "1428444852",
                        elements: [{
                            title: "Oculus Rift",
                            subtitle: "Includes: headset, sensor, remote",
                            quantity: 1,
                            price: 599.00,
                            currency: "USD",
                            image_url: SERVER_URL + "/assets/riftsq.png"
                        }, {
                            title: "Samsung Gear VR",
                            subtitle: "Frost White",
                            quantity: 1,
                            price: 99.99,
                            currency: "USD",
                            image_url: SERVER_URL + "/assets/gearvrsq.png"
                        }],
                        address: {
                            street_1: "1 Hacker Way",
                            street_2: "",
                            city: "Menlo Park",
                            postal_code: "94025",
                            state: "CA",
                            country: "US"
                        },
                        summary: {
                            subtotal: 698.99,
                            shipping_cost: 20.00,
                            total_tax: 57.67,
                            total_cost: 626.66
                        },
                        adjustments: [{
                            name: "New Customer Discount",
                            amount: -50
                        }, {
                            name: "$100 Off Coupon",
                            amount: -100
                        }]
                    }
                }
            }
        };

        this.callSendAPI(messageData);
    },


    /*
     * Send a read receipt to indicate the message has been read
     *
     */
    sendReadReceipt: function(recipientId) {
        console.log("Sending a read receipt to mark message as seen");

        var messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "mark_seen"
        };

        this.callSendAPI(messageData);
    },

    /*
     * Turn typing indicator on
     *
     */
    sendTypingOn: function(recipientId) {
        console.log("Turning typing indicator on");

        var messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_on"
        };

        this.callSendAPI(messageData);
    },

    /*
     * Turn typing indicator off
     *
     */
    sendTypingOff: function(recipientId) {
        console.log("Turning typing indicator off");

        var messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_off"
        };

        this.callSendAPI(messageData);
    },

    /*
     * Send a message with the account linking call-to-action
     *
     */
    sendAccountLinking: function(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "Welcome. Link your account.",
                        buttons: [{
                            type: "account_link",
                            url: SERVER_URL + "/authorize"
                        }]
                    }
                }
            }
        };

        this.callSendAPI(messageData);
    },



    /*
     * Call the Send API. The message data goes in the body. If successful, we'll 
     * get the message id in a response 
     *
     */
    callSendAPI(messageData) {
        setTimeout(function() {
            request({
                uri: URL_API,
                qs: {
                    access_token: PAGE_ACCESS_TOKEN
                },
                method: 'POST',
                json: messageData
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var recipientId = body.recipient_id;
                    var messageId = body.message_id;

                    if (messageId) {
                        logger.info("Successfully sent message with id %s to recipient %s", messageId, recipientId);
                    }
                    else {
                        logger.info("Successfully called Send API for recipient %s", recipientId);
                    }
                }
                else {
                    logger.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
                }
            });
        }, millisecondsToWait);
    },

    formatActionPostback: function(title, payload) {
        var message = JSON.stringify({
            type: "postback",
            title: title,
            payload: payload
        });
        return message;
    },
    
    formatActionWebUrl: function(title, payload) {
        var message = JSON.stringify({
            type: "web_url",
            title: title,
            payload: payload
        });
        return message;
    },

    convertArrayToAction: function(array) {
        var list_act = "";
        for (var i = 0; i < array.length; i++) {
            var temp = array[i];
            list_act = list_act + this.formatActionPostback(temp, temp);

            if (i === 0 && array.length > 1) {
                list_act = list_act + ",";
            }
            else if (i < array.length - 1) {
                list_act = list_act + ",";
            }
        }
        return list_act;
    },

    convertArrayToAction_with_payload: function(array) {
        var list_act = "";
        for (var i = 0; i < array.length; i++) {
            var temp = JSON.parse(array[i]);
            list_act = list_act + this.formatActionPostback(temp.title, temp.payload);

            if (i === 0 && array.length > 1) {
                list_act = list_act + ",";
            }
            else if (i < array.length - 1) {
                list_act = list_act + ",";
            }
        }
        return list_act;
    },

    convert_array_elements_generic_template: function(messageValue) {
        var message = JSON.stringify({
            title: "rift",
            subtitle: "Next-generation virtual reality",
            //          item_url: "https://www.oculus.com/en-us/rift/",
            image_url: SERVER_URL + "/assets/rift.png",
            buttons: "[" + messageValue + "]",
        });
        return message;
    },

    format_button_message: function(title, buttons) {
        var obj = JSON.stringify({
            title: title,
            buttons: "[" + buttons + "]"
        });
        return obj;
    },

}
