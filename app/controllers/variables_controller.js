var Variable = require("../models/variable");

function VariablesController() {};

VariablesController.prototype.create = function(name, value) {
    var variable = new Variable({
        name: name,
        value: value
    });

    variable.save(function(err, variable) {
        console.log(err, variable);
        if (err) return console.error(error);
    });

    return variable;
};


VariablesController.prototype.update = function(name, value, callback) {
    Variable.findOne({
        name: name
    }).exec(function(err, variable) {
        variable.value = value;
        variable.save(function() {
            callback(variable);
        });
    });
};

VariablesController.prototype.edit = function(req, res) {
    Variable.find().exec(function(err, variables) {
        res.render('configs', {
            variables: JSON.stringify(variables)
        });
    });
};

VariablesController.prototype.index = function(req, res) {
    Variable.find().exec(function(err, variables) {
        res.render('monitor', {
            variables: JSON.stringify(variables)
        });
    });
};

module.exports = new VariablesController();