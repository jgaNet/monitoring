var userController = require("../app/controllers/users_controller");
var variablesController = require("../app/controllers/variables_controller");

function Application(app, io, db) {
    this.io = io;
    this.app = app;
    this.db = db;
    this.users = {};
    this.variables = {};
    this.schemas = {};
    this.models = {};
    this.configure();
}

Application.prototype.configure = function() {
    var core = this;
    core.events();
};

Application.prototype.events = function() {
    var core = this;
    core.io.on('connection', function(socket) {
        var user = socket.request.user;
        if (user) {
            if (typeof core.users[user.username] == "undefined") {
                core.users[user.username] = {
                    core: core,
                    socket: socket,
                    params: user
                }
                userController.connection(core.users[user.username]);
            } else {
                userController.reconnection(core.users[user.username], socket);
            }
        };
    });
};

Application.prototype.sendToAll = function(event, data) {
    for (var i in this.users) {
        this.users[i].socket.emit(event, data);
    }
};

module.exports = function(app, io, db) {
    return new Application(app, io, db);
};