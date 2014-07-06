var User = require("./user");
var createVariable = require("./variable");

function Core(app, io, db) {
    this.io = io;
    this.app = app;
    this.db = db;
    this.users = {};
    this.variables = {};
    this.schemas = {};
    this.models = {};
    this.configure();
}

Core.prototype.configure = function() {
    var core = this;

    //test variable
    core.variables["test"] = createVariable("test", 0);
    core.variables["test2"] = createVariable("test2", 0);

    core.events();
};

Core.prototype.events = function () {
    var core = this;
    core.io.on('connection', function(socket){
        core.users[socket.id] = new User(core, socket);
    });
};

Core.prototype.sendToAll = function (event, data) {
    for(var i in this.users){
        this.users[i].socket.emit(event, data);
    }
};



module.exports = Core;