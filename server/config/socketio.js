var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var passportSocketIo = require("passport.socketio");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

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
        store: new MongoStore({
            mongoose_connection: mongoose.connection
        }),
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));
    return io;
};


module.exports = config