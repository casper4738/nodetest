var
    HashMap = require('hashmap'),
    flagMap = new HashMap();

module.exports = {

    /* UTILITY */
    setFlag: function(channelId, keyFlag, keyValue) {
        if (flagMap.has(channelId)) {
            var KEYFLAG = flagMap.get(channelId);
            KEYFLAG[keyFlag] = keyValue;
        }
        else {
            var KEYFLAG = {};
            KEYFLAG[keyFlag] = keyValue;
            flagMap.set(channelId, KEYFLAG);
        }
    },

    getFlag: function(channelId, keyFlag) {
        if (flagMap.has(channelId)) {
            var KEYFLAG = flagMap.get(channelId);
            return KEYFLAG[keyFlag];
        }
        else {
            return null;
        }
    },
    /* END OF UTILITY*/

};
