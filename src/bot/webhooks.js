var q = require('q');
var room = require('../api/room');
var config = require('../config.js');

var webhookIds = [];

module.exports.createWebhooks = function() {
    var deferred = q.defer();

    q.all([
        room.createWebhook(
            'http://' + config.externalUrl + '/room/enter',
            'room_enter',
            'aaronfriendbot+roomEnter'
        ),
        room.createWebhook(
            'http://' + config.externalUrl + '/room/exit',
            'room_exit',
            'aaronfriendbot+exit'
        ),
        room.createWebhook(
            'http://' + config.externalUrl + '/room/message',
            'room_message',
            'aaronfriendbot+message'
        ),
        room.createWebhook(
            'http://' + config.externalUrl + '/room/notification',
            'room_notification',
            'aaronfriendbot+notification'
        ),
        room.createWebhook(
            'http://' + config.externalUrl + '/room/topicChange',
            'room_topic_change',
            'aaronfriendbot+topicChange'
        )
    ]).then(
        function(results) {
            results.forEach(function(result) {
                webhookIds.push(result.webhook_id);
            });

            deferred.resolve(results);
        },
        function(failures) {
            deferred.reject(failures);
        }
    );

    return deferred.promise;
};

module.exports.destroyWebhooks = function() {
    var deferred = q.defer();

    var promises = [];

    webhookIds.forEach(function(webhookId) {
        promises.push(room.deleteWebhook(webhookId));
    });

    q.all(promises).then(
        function(results) {
            deferred.resolve(results);
        },
        function() {
            deferred.reject(failures);
        }
    );

    return deferred.promise;
};
