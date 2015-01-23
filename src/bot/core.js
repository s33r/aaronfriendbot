var express = require('express');
var bodyParser = require('body-parser');
var q = require('q');

var config = require('../config.js');
var webhooks = require('./webhooks.js');
var room = require('../api/room.js');


var listener = express();
listener.use(bodyParser.json());


var server = null;


var modules = [
    require('./logger')
];


var activeModules = [modules[0]];

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

            pollHistory();
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

var pollHistory = function() {
    var errorCounter = 0;

    var interval = setInterval(function() {
        room.listHistory().then(
            function(data) {
                parseHistory(data);
            },
            function(error) {
                errorCounter++;
                console.log(error);

                if(errorCounter > 5) {
                    console.log('listHistory has failed 5 times, killing interval.');
                    clearInterval(interval);
                }
            }
        );
    }, 5000);
};



var messageMap = {};

var parseHistory = function(history) {
    var newMessageQueue = [];
    var oldMessageQueue = [];

    history.forEach(function(entry) {
        if(messageMap[entry]){
            messageMap[entry.id].marked = true;
        } else {
            newMessageQueue.push(entry);
            messageMap[entry.id] = {
                marked: true,
                content: entry
            };
        }
    });

    messageMap.forEach(function(entry) {
        if(!entry.marked) {
           oldMessageQueue.push(entry);
        }
    });

    oldMessageQueue.forEach(function(oldEntry) {
        delete messageMap[oldEntry.content.id];
    });

    newMessageQueue.forEach(function(newEntry) {
        if(newEntry.content.type === 'message') {
            activeModules.forEach(function(module) {
                module.onRoomMessage(newEntry.content);
            });
        } else if(newEntry.content.type === 'notification') {
            activeModules.forEach(function(module) {
                module.onRoomNotification(newEntry.content);
            });
        }
    });

};






