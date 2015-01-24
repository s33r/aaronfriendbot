var q = require('q');
var config = require('../config.js');
var events = require("events");

var room = require('../api/room.js');

var eventEmitter = null;


var interval = null;
var errorCounter = 0;
var firstIteration = true;

var messageMap = {};

var onUpdate = function() {
    room.listHistory().then(
        function(data) {

            parseHistory(data, firstIteration);
            errorCounter = 0;
            firstIteration = false;
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
};

var parseHistory = function(history, skipPastMessages) {
    var newMessageQueue = [];
    var oldMessageQueue = [];

    for(var j = 0; j < history.items.length; j++) {
        var historyItem = history.items[j];

        if(messageMap[historyItem.id]){
            messageMap[historyItem.id].marked = true;
        } else {
            var timestamp = new Date(historyItem.date);
            var addMessage =  !(skipPastMessages && (timestamp < Date.now()));

            if(addMessage) {
                newMessageQueue.push(historyItem);
            }

            messageMap[historyItem.id] = {
                marked: true,
                content: historyItem
            };
        }
    }

    for (var key in messageMap) {
        if(messageMap.hasOwnProperty(key)) {
            var entry = messageMap[key];
            if(!entry.marked) {
                oldMessageQueue.push(entry);
            }
        }
    }

    for(var i = 0; i < oldMessageQueue.length; i++) {
        var oldEntry = oldMessageQueue[i];
        delete messageMap[oldEntry.content.id];
    }

    for(var ij = 0; ij < newMessageQueue.length; ij++) {
        var newEntry = newMessageQueue[ij];
        var event = 'received-' + newEntry.type;

        eventEmitter.emit(event, newEntry);
    }
};

module.exports.initialize = function(emitter) {
    eventEmitter = emitter;
    interval = setInterval(onUpdate, 5000);
};

module.exports.uninitalize = function() {
    clearInterval(interval);
};