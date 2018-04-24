'use strict';

var request = require('request');

var http = "http://localhost:3000/";

module.exports.create = function (cookies, options, j) {
    return new Promise(function(resolve, reject) {
        request({
            method: 'POST',
            jar: j,
            url: http + 'api/article/create',
            form: {
                aTitle: options.title,
                description: options.description,
                text: options.text
            },
            headers: [{
                'set-cookie': cookies
            }]
        }, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        });
    })
};

module.exports.auth = function (userform, j) {
    return new Promise(function (resolve, reject) {
        request({
            method: 'POST',
            url: http + 'auth',
            jar: j,
            form: userform
        }, function (error, response, body) {
            if (error || body[body.length - 1] == 'h') {
                reject(error || 'Неправильный логин или пароль');
            } else {
                resolve(response.headers['set-cookie']);
            }
        });
    });
};

function getPost(id, j) {
    return new Promise(function (resolve, reject) {
        request({
            method: 'GET',
            url: http + 'api/article/get/' + id,
            jar: j
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                var post = JSON.parse(body);
                resolve(post);
            }
        });
    });
}

function deletePost(cookies, options, j) {
    request({
        method: 'DELETE',
        url: http + 'api/article/delete/' + options.id,
        jar: j,
        headers: [{
            'set-cookie': cookies
        }]
    }, function (error, response, body) {
        if (error) {
            return console.error(error);
        }
        return body;
    });
}

function updatePost(cookies, options, j) {
    request({
        method: 'POST',
        url: http + 'api/article/update/' + options.id,
        jar: j,
        form: {
            aTitle: options.title,
            description: options.description,
            text: options.text
        },
        headers: [{
            'set-cookie': cookies
        }]
    }, function (error, response, body) {
        if (error) {
            return console.error(error);
        }
        console.log(body);
    });
}

module.exports.getProfile = function (cookies, j) {
    return new Promise(function (resolve, reject) {
        request({
            method: 'GET',
            url: http + 'api/profile',
            jar: j,
            headers: [{
                'set-cookie': cookies
            }]
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
};

module.exports.getLastPost = function () {
    return new Promise(function (resolve, reject) {
        request({
            method: 'GET',
            url: http + 'api/article/last',
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
};