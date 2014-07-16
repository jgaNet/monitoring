var Exec = require("../libs/exec");
var User = require("../models/user");

function UsersController() {}

UsersController.prototype.connection = function(user) {
    user.socket.on("disconnect", function() {
        user.disconnected = true;
        setTimeout(function() { // waiting reconnection before deleted 
            if (user.disconnected) {
                delete user.app.users[user.params.username];
            }
        }, 10000);
    });

    if (user.params.trust >= 1) {
        user.socket.on("exec", function(data) {
            if (/^\d+$/.test(data.value)) {
                var cmd = {
                    main: "./server/bash/" + data.name + ".sh",
                    args: [data.value]
                };

                var exec = new Exec(cmd, user, user.app.variables[data.name], data.value);
                exec.launch();
            } else {
                user.socket.emit("exec stderr", {
                    stderr: "value must be a number type"
                });
            }
        });
    }
};

UsersController.prototype.reconnection = function(user, socket) {
    user.disconnected = false;
    user.socket = socket;
    this.connection(user);
};

UsersController.prototype.index = function(req, res) {
    User.find().exec(function(err, users) {
        res.render('users/index', {
            users: JSON.stringify(users)
        });
    });
};

UsersController.prototype.show = function(req, res) {
    User.findOne({
        "_id": req.params.id
    }).exec(function(err, user) {
        res.render('users/show', {
            user: user
        });
    });
};

UsersController.prototype.edit = function(req, res) {
    User.findOne({
        "_id": req.params.id
    }).exec(function(err, user) {
        res.render('users/edit', {
            user: user
        });
    });
};

UsersController.prototype.update = function(req, res) {
    User.findOne({
        "_id": req.body._id
    }).exec(function(err, user) {
        user.username = req.body.username;
        user.email = req.body.email;

        if (req.body.password !== "") {
            user.password = req.body.password;
        }

        user.trust = req.body.trust;
        user.save(function() {
            res.render('users/show', {
                user: user
            });
        });
    });
};

UsersController.prototype.delete = function(req, res) {
    User.findOne({
        "_id": req.params.id
    }).remove().exec(function(err) {
        res.redirect("/users/");
    });
};


UsersController.prototype.new = function(req, res) {
    res.render('users/create');
};

UsersController.prototype.create = function(req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        trust: parseInt(req.body.trust, 10)
    });
    newUser.save(function() {
        res.send("utilisateur créé");
    });
};

UsersController.prototype.account = function(req, res) {
    res.render('users/account', {
        user: req.user
    });
};


module.exports = new UsersController();