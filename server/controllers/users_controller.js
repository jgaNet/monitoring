var User = require("../models/user");
var variablesController = require("../controllers/variables_controller");

function UsersController() {}

UsersController.prototype.connection = function(user) {
    var controller = this;

    user.socket.on("disconnect", function() {
        user.disconnected = true;
        setTimeout(function() { // waiting reconnection before deleted 
            if (user.disconnected) {
                delete user.app.users[user.params.username];
            }
        }, 10000);
    });

};

UsersController.prototype.reconnection = function(user, socket) {
    user.disconnected = false;
    user.socket = socket;
    this.connection(user);
};




UsersController.prototype.index = function(req, res) {
    User.all(function(err, users) {
        res.render('users/index', {
            users: JSON.stringify(users)
        });
    });
};

UsersController.prototype.show = function(req, res) {
    User.findOne({
        where: {
            "id": req.params.id
        }
    }, function(err, user) {
        res.render('users/show', {
            user: user
        });
    });
};

UsersController.prototype.edit = function(req, res) {
    User.findOne({
        where: {
            "id": req.params.id
        }
    }, function(err, user) {
        res.render('users/edit', {
            user: user
        });
    });
};

UsersController.prototype.update = function(req, res) {

    User.findOne({
        where: {
            "id": req.body.id
        }
    }, function(err, user) {

        var userUpdate = {
            username: req.body.username,
            email: req.body.email,
            trust: req.body.trust
        }

        if (req.body.password) {
            userUpdate["password"] = req.body.password
        }

        user.updateAttributes(userUpdate, function(err, user) {
            res.render('users/show', {
                user: user
            });
        });

    });
};

UsersController.prototype.delete = function(req, res) {
    User.remove({
        where: {
            "id": req.params.id
        }
    }, function(err) {
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