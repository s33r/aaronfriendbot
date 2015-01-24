var api = require('../api');
var config = require('../config');

module.exports.listRooms = function() {
    return api.get('room');
};

module.exports.getRoom = function(roomId) {
    return api.get('room/' + roomId);
};

module.exports.postTextNotification = function(message, color, notify) {
    var postData = {
        message_format: 'text'
    };

    postData.color = color || 'green';
    postData.message = message || 'NULL MESSAGE!';
    postData.notify = notify || false;

    return api.post('room/' + config.room + '/notification', postData);
};

module.exports.postHtmlNotification = function(message, color, notify) {
    var postData = {
        message_format: 'html'
    };

    postData.color = color || 'green';
    postData.message = message || 'NULL MESSAGE!';
    postData.notify = notify || false;

    return api.post('room/' + config.room + '/notification', postData);
};

module.exports.postMessage = function(message, notify) {

};

module.exports.listWebhooks = function(roomId) {
    return api.get('room/' + roomId + '/webhook');
};

module.exports.createWebhook = function(url, event, name) {
    var postData = {
        url: url,
        event: event,
        name: name
    };

    return api.post('room/' + config.room + '/webhook', postData);
};

module.exports.deleteWebhook = function(webhookId) {
    return api.del('room/' + config.room + '/webhook', webhookId);
};

module.exports.listHistory = function() {
    return api.get('room/' + config.room + '/history');
};