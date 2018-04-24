'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');

module.exports = function () {
    function API(user, http) {
        var _this = this;

        _classCallCheck(this, API);

        this.user = user;
        this.http = http;
        this.cookies = null;
        this.jar = request.jar();
        this.isauth = false;

        this.auth(user).then(function (cookies) {
            _this.cookies = cookies;
            _this.auth = true;
        }).catch(function (error) {
            console.log(error);
        });
    }

    _createClass(API, [{
        key: 'auth',
        value: function auth(userform) {
            return new Promise(function (resolve, reject) {
                request({
                    method: 'POST',
                    url: this.http + 'auth',
                    jar: this.jar,
                    form: userform
                }, function (error, response, body) {
                    if (error || body[body.length - 1] == 'h') {
                        reject(error || 'Неправильный логин или пароль');
                    } else {
                        cookies = response.headers['set-cookie'];
                        resolve(cookies);
                    }
                });
            });
        }
    }, {
        key: 'isAuth',
        value: function isAuth() {
            return this.isauth;
        }
    }, {
        key: 'createPost',
        value: function createPost(options) {
            request({
                method: 'POST',
                jar: this.jar,
                url: this.http + 'api/article/create',
                form: {
                    aTitle: options.title,
                    description: options.description,
                    text: options.text
                },
                headers: [{
                    'set-cookie': this.cookies
                }]
            }, function (error, response, body) {
                if (error) {
                    return console.log(error);
                }
                console.log(body);
                return body;
            });
        }
    }, {
        key: 'getPost',
        value: function getPost(id) {
            return new Promise(function (resolve, reject) {
                request({
                    method: 'GET',
                    url: this.http + 'api/article/get/' + id,
                    jar: this.jar
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
    }, {
        key: 'deletePost',
        value: function deletePost(id) {
            request({
                method: 'DELETE',
                url: this.http + 'api/article/delete/' + id,
                jar: this.jar,
                headers: [{
                    'set-cookie': this.cookies
                }]
            }, function (error, response, body) {
                if (error) {
                    return console.log(error);;
                }
                return body;
            });
        }
    }, {
        key: 'updatePost',
        value: function updatePost(cookies, options) {
            request({
                method: 'POST',
                url: this.http + 'api/article/update/' + options.id,
                jar: this.jar,
                form: {
                    aTitle: options.title,
                    description: options.description,
                    text: options.text
                },
                headers: [{
                    'set-cookie': this.cookies
                }]
            }, function (error, response, body) {
                if (error) {
                    return console.log(error);
                }
                console.log(body);
                return body;
            });
        }
    }]);

    return API;
}();