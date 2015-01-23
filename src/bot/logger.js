module.exports.name = 'logger';

module.exports.onRoomEnter = function(request) {
    console.log(request);
    console.log('onRoomEnter ' + JSON.stringify(request, null, '\t'));
};

module.exports.onRoomExit = function(request) {
    console.log('onRoomExit ' + JSON.stringify(request, null, '\t'));
};

module.exports.onRoomMessage = function(request) {
    console.log('onRoomMessage ' + JSON.stringify(request, null, '\t'));
};

module.exports.onRoomNotification = function(request) {
    console.log('onRoomNotification ' + JSON.stringify(request, null, '\t'));
};

module.exports.onRoomTopicChange = function(request) {
    console.log('onRoomTopicChange ' + JSON.stringify(request, null, '\t'));
};
