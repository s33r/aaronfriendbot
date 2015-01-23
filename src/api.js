var q = require('q');
var config = require('./config');
var rest = require('restler');

var defaultOptions = {
    accessToken: config.token,
    timeout: config.timeout,
    headers: {
        'Accept': '*/*',
        'User-Agent': config.userAgent,
        'Content-Type': 'application/json'

    }
};


module.exports.get = function(url) {
    var deferred = q.defer();
    var fullUrl = config.baseUrl + url;

    var request = rest.get(fullUrl, defaultOptions);

    request.on('success', function(data) {
        deferred.resolve(data);
    });

    request.on('error', function(error, response) {
        deferred.reject({
            error: error,
            response: response
        });
    });

    request.on('fail', function(data, response) {
        deferred.reject({
            error: response,
            response: data
        });
    });

    request.on('timeout', function(ms) {
        deferred.reject({
            error: 'timeout',
            response: ms
        });
    });

    return deferred.promise;
};

module.exports.post = function(url, postData) {
    var deferred = q.defer();
    var fullUrl = config.baseUrl + url;

    var request = rest.postJson(fullUrl, postData, defaultOptions);

    request.on('success', function(data) {
        deferred.resolve(data);
    });

    request.on('error', function(error, response) {
        deferred.reject({
            error: error,
            response: response
        });
    });

    request.on('fail', function(data, response) {
        deferred.reject({
            error: response,
            response: data
        });
    });

    request.on('timeout', function(ms) {
        deferred.reject({
            error: 'timeout',
            response: ms
        });
    });

    return deferred.promise;
};

module.exports.del = function(url) {
    var deferred = q.defer();
    var fullUrl = config.baseUrl + url;

    var request = rest.del(fullUrl, defaultOptions);

    request.on('success', function(data) {
        deferred.resolve(data);
    });

    request.on('error', function(error, response) {
        deferred.reject({
            error: error,
            response: response
        });
    });

    request.on('fail', function(data, response) {
        deferred.reject({
            error: response,
            response: data
        });
    });

    request.on('timeout', function(ms) {
        deferred.reject({
            error: 'timeout',
            response: ms
        });
    });

    return deferred.promise;
};
