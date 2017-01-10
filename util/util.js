module.exports = {

    isCheckFlagMenu: function(currentMenu, menu) {
        return currentMenu === menu;
    },

    isEquals: function(currentMenu, menu) {
        return currentMenu.toLowerCase() === menu.toLowerCase();
    },

    isNumeric: function(n) {
        return !isNaN(n);
    },

    isFormatNumberATMCard: function(input) {
        var regex1 = new RegExp("^[0-9]{16}$");
        var regex2 = new RegExp("^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$");
        var regex3 = new RegExp("^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$");

        if (regex1.test(input) || regex2.test(input) || regex3.test(input)) {
            return true;
        }
        else {
            return false;
        }
    },

    isFormatNumberPhone: function(input) {
        var regex = new RegExp("^#[A-Za-z0-9]+#[A-Za-z0-9]+$");
        if (regex.test(input)) {
            return true;
        }
        else {
            return false;
        }
    },
    
    isFormatNumberCreditCard: function(input) {
        var regex1 = new RegExp("^[0-9]{16}$");
        var regex2 = new RegExp("^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$");
        var regex3 = new RegExp("^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$");

        if (regex1.test(input) || regex2.test(input) || regex3.test(input)) {
            return true;
        }
        else {
            return false;
        }
    },

    isFormatOneTimePassword: function(input) {
        var regex = new RegExp("^[0-9]{6}$");
        if (regex.test(input)) {
            return true;
        }
        else {
            return false;
        }
    },

    getFormatComma: function(loop_message, index, array, messages) {
        if (loop_message === -1) {}
        else if (index === array.length - 1) {}
        else if (loop_message === 0 && array.length > 1) {
            messages = messages + ",";
        }
        else if (loop_message < array.length - 1) {
            messages = messages + ",";
        }
        return messages;
    },
    
    convert_number_phone: function(MSISDNID, MSISDN) {
        var obj = JSON.stringify({
            MSISDNID: MSISDNID,
            MSISDN: MSISDN
        });
        return obj;
    },

}
