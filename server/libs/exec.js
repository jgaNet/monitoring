var spawn = require('child_process').spawn;
var variablesController = require("../controllers/variables_controller");

function Exec(cmd, user, variable, value) {
    this.user = user;
    this.cmd = cmd;
    this.variable = variable;
    this.value = value;
}

Exec.prototype.launch = function() {
    var exec = this;

    console.log(this.cmd.main, this.cmd.args);
    this.spawn = spawn(this.cmd.main, this.cmd.args);

    this.spawn.stdout.on('data', function(data) {
        variablesController.update(exec.variable.name, data.toString(), function(variable) {
            exec.user.app.sendToAll('exec stdout', {
                stdout: variable
            });
        });
    });

    this.spawn.stderr.on('data', function(data) {
        exec.user.app.sendToAll('exec stderr', {
            stderr: data.toString()
        });
    });

    this.spawn.on('close', function(code) {
        exec.user.app.sendToAll('exec close', {
            close: code.toString()
        });
    });
};


module.exports = Exec;