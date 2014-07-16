var path = require('path');
var settings = require("../../settings");

var home = require(settings.routesFolder + 'home');
var users = require(settings.routesFolder + 'users');
var files = require(settings.routesFolder + 'files');

var config = function(app, express) {

    app.set('views', path.join(settings.serverFolder, '/views'));
    app.set('view engine', 'ejs');

    app.use(express.static(settings.clientFolder));

    app.use('/', home);
    app.use('/users', users);
    app.use('/files', files);
};


module.exports = config;