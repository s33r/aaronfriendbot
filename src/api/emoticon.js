var api = require('../api');
var config = require('../config');

module.exports.listEmoticons = function() {
    return api.get('emoticon');
};

module.exports.getEmoticon = function(emoticonId) {
    return api.get('emoticon/' + emoticonId);
};

