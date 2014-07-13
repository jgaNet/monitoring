var passport = require('passport');

var config = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());
};


module.exports = config;