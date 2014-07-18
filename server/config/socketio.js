var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var passportSocketIo = require("passport.socketio");
var session = require('express-session');
var CaminteStore = require('connect-caminte')(session);

var onAuthorizeSuccess = function(data, accept) {
    accept();
};

var onAuthorizeFail = function(data, message, error, accept) {
    if (error) {
        accept(new Error(message));
    }
};

var config = function(server) {
    var io = require('socket.io')(server);
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        secret: 'monitoring',
        key: 'express.sid',
        store: new CaminteStore({
            driver: 'redis',
            collection: 'monitoring',
            db: {
                database: "./db/monitoring.db"
            }
        }),
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));
    return io;
};


module.exports = config