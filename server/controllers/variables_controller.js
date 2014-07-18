var Variable = require("../models/variable");
var application = require('../controllers/application_controller');

function VariablesController() {};

VariablesController.prototype.create = function(name, value) {
    var variable = new Variable({
        name: name,
        value: value || "0"
    });

    variable.save(function(err, variable) {
        if (err) {
            return console.error(error);
        }
        return variable;
    });
};


VariablesController.prototype.update = function(name, value, callback) {
    Variable.update({
        where: {
            name: name
        }
    }, {
        value: value || "0"
    }, function(err, variable) {
        callback(variable);
    });
};

VariablesController.prototype.edit = function(req, res) {
    Variable.all(function(err, variables) {
        res.render('configs', {
            variables: JSON.stringify(variables)
        });
    });
};

VariablesController.prototype.index = function(req, res) {
    Variable.all(function(err, variables) {
        res.render('monitor', {
            variables: JSON.stringify(variables)
        });
    });
};

VariablesController.prototype.exec = function(req, res) {
    Variable.findOne({
        where: {
            id: req.body.id
        }
    }, function(err, variable) {

        var execution = variable.exec(req.body.value, function(newValue) {
            return /^\d+$/.test(newValue);
        });

        execution.on("validation error", function() {
            res.send({
                error: "Value must be a number type"
            });
        });

        execution.on("stdout", function(variable, newValue) {
            variable.updateAttribute('value', newValue.toString() || "0", function(err, variable) {
                application.sendToAll('exec stdout', {
                    stdout: variable
                });
                res.send({
                    message: "Variable updated"
                });
            });
        });

        execution.on("stderr", function(variable, error) {
            application.sendToAll('exec stderr', {
                stderr: error.toString()
            });

            res.send({
                error: JSON.stringify(error)
            });
        });

        execution.on("close", function(variable, code) {
            application.sendToAll('exec close', {
                close: code.toString()
            });
        });

        execution.launch();

    });
};

module.exports = new VariablesController();