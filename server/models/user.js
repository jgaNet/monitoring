var schema = require('../config/db');
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;


var User = schema.define("User", {
    username: {
        type: schema.String,
        index: true
    },
    email: String,
    password: {
        type: schema.String,
        index: true
    },
    trust: Number
});

User.validatesPresenceOf('username', 'email', 'password', 'trust');

User.validatesUniquenessOf('username', {
    message: 'email is not unique'
});
User.validatesUniquenessOf('password', {
    message: 'password is not unique'
});

User.beforeSave = function(next) {
    var user = this;

    /*if (!user.isModified('password')) {
        return next();
    }*/

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        };

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
};

User.prototype.comparePassword = function(candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return cb(err)
        };

        cb(null, isMatch);
    });
};


module.exports = User;