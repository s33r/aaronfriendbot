var q = require('q');
var express = require('express');
var bodyParser = require('body-parser');
var webhooks = require('./webhooks.js');

var listener = express();
listener.use(bodyParser.json());

var server = null;



listener.post('/room/enter', function(request, response) {
    activeModules.forEach(function(module) {
        module.onRoomEnter(request.body);
    });

    response.sendStatus(204);
});

listener.post('/room/exit', function(request, response) {
    activeModules.forEach(function(module) {
        module.onRoomExit(request);
    });

    response.sendStatus(204);
});

listener.post('/room/message', function(request, response) {
    activeModules.forEach(function(module) {
        module.onRoomMessage(request);
    });

    response.sendStatus(204);
});

listener.post('/room/notification', function(request, response) {
    activeModules.forEach(function(module) {
        module.onRoomNotification(request);
    });

    response.sendStatus(204);
});

listener.post('/room/topicChange', function(request, response) {
    activeModules.forEach(function(module) {
        module.onRoomTopicChange(request);
    });

    response.sendStatus(204);
});

module.exports.initialize = function() {

    server = listener.listen(4002, function () {

        var host = server.address().address;
        var port = server.address().port;

        console.log('aaronfriendbot is at http://%s:%s', host, port);
    });

    webhooks.createWebhooks().then(
        function(results) {

        },
        function(failures) {
            console.log('Warning, unable to create webhooks. Falling back to polling mode which only supports message and notification hooks.');
            server.close();

        }
    );
};

module.exports.uninitalize = function() {
    try {
        server.close();
    } catch (exception) {
        console.log(exception);
    }

    return webhooks.destroyWebhooks();
};