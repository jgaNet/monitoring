var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var config = function(app) {
    app.use(session({
        secret: 'monitoring',
        key: 'express.sid',
        saveUninitialized: true,
        resave: true,
        store: new MongoStore({
            mongoose_connection: mongoose.connection
        })
    }));
};


module.exports = config;