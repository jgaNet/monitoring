var spawn = require('child_process').spawn;

var events = require('events');


function Exec(options) {
    this.cmd = options.cmd;
    this.variable = options.variable;
    this.value = options.value;
    this.validation = options.validation;
}

Exec.prototype.__proto__ = events.EventEmitter.prototype;


Exec.prototype.launch = function() {
    var exec = this;

    if (!this.validation(exec.value)) {
        exec.emit("validation error");
        return;
    }

    this.spawn = spawn(this.cmd.main, this.cmd.args);

    this.spawn.stdout.on('data', function(data) {
        exec.emit("stdout", exec.variable, data);
    });

    this.spawn.stderr.on('data', function(data) {
        exec.emit("stderr", exec.variable, data);
    });

    this.spawn.on('close', function(code) {
        exec.emit("close", exec.variable, code);
    });
};


module.exports = Exec;