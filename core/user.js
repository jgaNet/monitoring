var Exec = require("./exec");

function User(core, socket) {
    this.core = core;
    this.socket = socket;
    this.params = socket.request.user;
    this.disconnected = false;
    this.events();
}

User.prototype.setSocket = function(socket) {
    this.disconnected = false;
    this.socket = socket;
    this.events();
}

User.prototype.events = function() {
    var user = this;

    this.socket.on("disconnect", function() {
        user.disconnected = true;
        setTimeout(function() { // waiting reconnection before deleted 
            if (user.disconnected) {
                delete user.core.users[user.params.username];
            }
        }, 10000);
    });

    if (this.params.trust >= 1) {
        this.socket.on("exec", function(data) {
            if (/^\d+$/.test(data.value)) {
                var cmd = {
                    main: "./bash/" + data.name + ".sh",
                    args: [data.value]
                };

                var exec = new Exec(cmd, user, user.core.variables[data.name], data.value);
                exec.launch();
            } else {
                user.socket.emit("exec stderr", {
                    stderr: "value must be a number type"
                });
            }
        });
    }

};

module.exports = User;