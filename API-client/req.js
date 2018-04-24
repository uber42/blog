
var http = "http://localhost:3000/";
getLastPost = function () {
    return new Promise(function (resolve, reject) {
        request({
            method: 'GET',
            url: http + 'api/article/post',
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
};

getLastPost()