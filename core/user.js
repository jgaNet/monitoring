var Exec = require("./exec");

function User(core, socket) {
    this.core = core;
    this.socket = socket;
    this.events();
}

User.prototype.events = function () {
    var user = this;

    this.socket.on("disconnect", function(){
        delete user.core.users[user.socket.id];
    });

    this.socket.on("exec", function (data){
      var cmd = {
        main : "./bash/"+data.name+".sh",
        args : [data.value]
      };

      var exec = new Exec(cmd, user, user.core.variables[data.name], data.value);
      exec.launch();
    });
};

module.exports = User;