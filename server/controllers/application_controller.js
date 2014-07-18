var passport = require('passport');
var userController = require("./users_controller");
var application;

function ApplicationController() {
    this.users = {};
    this.variables = {};
    this.schemas = {};
    this.models = {};
};

ApplicationController.prototype.configure = function(app, io, db) {
    this.io = io;
    this.app = app;
    this.db = db;
    this.socketConnection();
};

ApplicationController.prototype.socketConnection = function() {
    var app = this;
    app.io.on('connection', function(socket) {
        var user = socket.request.user;
        if (user) {
            if (typeof app.users[user.username] == "undefined") {
                app.users[user.username] = {
                    app: app,
                    socket: socket,
                    params: user
                }
                userController.connection(app.users[user.username]);
            } else {
                userController.reconnection(app.users[user.username], socket);
            }
        };
    });
};

ApplicationController.prototype.sendToAll = function(event, data) {
    for (var i in this.users) {
        this.users[i].socket.emit(event, data);
    }
};


ApplicationController.prototype.getlogin = function(req, res) {
    res.render('users/login', {
        user: req.user,
        message: req.session.messages
    });
};

ApplicationController.prototype.postlogin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {

        if (err) {
            return next(err);
        }


        if (!user) {
            req.session.messages = [info.message];
            return res.redirect('/login')
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }

            return res.redirect('/users/account');
        });

    })(req, res, next);
};

ApplicationController.prototype.logout = function(req, res) {
    req.logout();
    req.session.destroy
    res.redirect('/');
};


var application = new ApplicationController();

module.exports = application;