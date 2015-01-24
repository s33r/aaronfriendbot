var q = require('q');
var events = require("events");
var minimist = require('minimist');

var apiPoll = require('../sources/apiPoll');
var room = require('../api/room.js');

var modules = [
    require('./logger')
];

var activeModules = [modules[0]];

var eventEmitter = new events.EventEmitter();

eventEmitter.addListener('received-message', function (data) {
    var command = parseCommandMessage(data);

    if(command) {
        executeCommand(command);
    }

    activeModules.forEach(function(module) {
        module.onRoomMessage(data);
    });
});

eventEmitter.addListener('received-notification', function (data) {
    activeModules.forEach(function(module) {
        module.onRoomNotification(data);
    });
});

eventEmitter.addListener('received-enter', function (data) {
    activeModules.forEach(function(module) {
        module.onRoomEnter(data);
    });
});

eventEmitter.addListener('received-exit', function (data) {
    activeModules.forEach(function(module) {
        module.onRoomExit(data);
    });
});

eventEmitter.addListener('received-topic_change', function (data) {
    activeModules.forEach(function(module) {
        module.onRoomTopicChange(data);
    });
});

var parseCommandMessage = function(message) {
    var messageString = message.message;

    if(!(messageString.indexOf('bot:') === 0)) {
        return null
    }

    messageString = messageString.replace('bot:', '').trim();

    var arguments = minimist(messageString.split(' '));
    var name = arguments._.shift();

    console.log('Command: ' + messageString);
    console.log('arguments: ' + JSON.stringify(arguments, null, '\t'));

    return {
        commandString: messageString,
        name: name,
        arguments: arguments
    };
};

var executeCommand = function(command) {

    if(command.name === 'sleep') {

    } else if(command.name === 'wake') {

    } else if(command.name === 'mode') {

    } else if(command.name === 'hello') {
        room.postTextNotification('Hi! Hi! :^)', 'gray');
    }

};

module.exports.initialize = function() {
    apiPoll.initialize(eventEmitter);
};

module.exports.uninitalize = function() {
    apiPoll.uninitalize();
};












