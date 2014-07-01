var spawn = require('child_process').spawn;

function Exec(cmd, user, variable, value) {
    this.user = user;
    this.cmd = cmd;
    this.variable = variable;
    this.value = value;
}

Exec.prototype.launch = function () {
    var exec = this;

    this.spawn = spawn(this.cmd.main, this.cmd.args);

    this.spawn.stdout.on('data', function (data) {
        exec.variable.update(data.toString());
        exec.user.core.sendToAll('exec stdout', {
            stdout : exec.variable.model
        });
    });

    this.spawn.stderr.on('data', function (data) {
        exec.user.core.sendToAll('exec stderr', {
            stderr : data.toString()
        });
    });

    this.spawn.on('close', function (code) {
        exec.user.core.sendToAll('exec close', {
            close : code.toString()
        });    
    });
};


module.exports = Exec;