var path = require('path');

var routes = require('../routes/index');
var users = require('../routes/users');
var files = require('../routes/files');
var settings = require("../settings");

var config = function(app, express) {
    app.set('views', path.join(settings.dirname, 'app/views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(settings.dirname, 'app/assets')));
    app.use('/', routes);
    app.use('/users', users);
    app.use('/files', files);
};


module.exports = config;