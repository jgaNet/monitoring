var schema = require('../config/db');
var Exec = require("../libs/exec");

var Variable = schema.define("Variable", {
    name: String,
    value: Number
});

Variable.prototype.exec = function(newValue, validation) {

    var variable = this;

    var exec = new Exec({
        cmd: {
            main: "./server/bash/" + variable.name + ".sh",
            args: [newValue]
        },
        variable: variable,
        value: newValue,
        validation: validation
    });

    return exec;
}

module.exports = Variable;