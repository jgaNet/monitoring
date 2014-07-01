var User = require("./user");
var mongoose = require('mongoose');
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

Core.prototype.configure = function() {
    var core = this;

    core.db.on("error", console.error);

    core.db.once('open', function(){
        core.schemas["variable"] = new mongoose.Schema({
            name: String,
            value: Number
        });
        core.models["variable"] = mongoose.model('Variable', core.schemas["variable"]);

        core.models["variable"].remove({}, function(err){
            console.log('collection remove');
        });

        //test variable
        core.variables["test"] = new Variable("test", 0, core.models.variable);
        core.variables["test2"] = new Variable("test2", 0, core.models.variable);
    });

    core.events();
};

module.exports = Core;