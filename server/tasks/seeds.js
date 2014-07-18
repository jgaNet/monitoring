var User = require("../models/user");
var Variable = require("../models/variable");
var variablesController = require("../controllers/variables_controller");

module.exports = function(application) {
    User.remove({}, function(err) {

        console.log('users remove');
        var admin = new User({
            username: "admin",
            email: "admin@test.fr",
            password: "password",
            trust: 3
        });
        admin.save(function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("admin created");
        });

        var operator = new User({
            username: "operator",
            email: "operator@test.fr",
            password: "password",
            trust: 2
        });

        operator.save(function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("operator created");
        });

        var user = new User({
            username: "user",
            email: "user@test.fr",
            password: "password",
            trust: 1
        });

        user.save(function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("user created");
        });

    });

    Variable.remove({}, function(err) {
        console.log('variables remove');

        application.variables["test"] = variablesController.create("test", 0);
        application.variables["test2"] = variablesController.create("test2", 0);

        console.log('variables created');
    });
}