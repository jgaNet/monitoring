var User = require("./user");
var Variable = require("./variable");

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
    core.variables["test"] = new Variable("test", 0);
    core.variables["test2"] = new Variable("test2", 0);

    core.events();
};

Core.prototype.events = function () {
    var core = this;
    core.io.on('connection', function(socket){
        var user = socket.request.user;
        if(user){
            if(typeof core.users[user.username] == "undefined"){
                core.users[user.username] = new User(core, socket);
            }else{
                core.users[user.username].setSocket(socket);
            }
        };
    });
};

Core.prototype.sendToAll = function (event, data) {
    for(var i in this.users){
        this.users[i].socket.emit(event, data);
    }
};

module.exports = Core;