var config = require('./config.js');

var core = require('./bot/core.js');

var room = require('./api/room');
var emoticon = require('./api/emoticon');




var onStart = function() {
    core.initialize();
};

var onExit = function() {
    core.uninitalize().then(
        function() {
            console.log('Shutting down boop boop beep.');
            process.exit();
        },
        function() {
            console.log('Shutting down boop boop beep.');
            process.exit();
        }
    );
};




process.on('exit', onExit);

//catches ctrl+c event
process.on('SIGINT',onExit);

//catches uncaught exceptions
process.on('uncaughtException', onExit);


onStart();
