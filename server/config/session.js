var session = require('express-session');
var CaminteStore = require('connect-caminte')(session);

var config = function(app) {
    app.use(session({
        secret: 'monitoring',
        key: 'express.sid',
        saveUninitialized: true,
        resave: true,
        store: new CaminteStore({
            driver: 'redis',
            collection: 'monitoring',
            db: {
                database: "./db/monitoring.db"
            }
        })
    }));
};


module.exports = config;