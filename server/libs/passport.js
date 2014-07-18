var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require("../models/user");

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({
        where: {
            username: username
        }
    }, function(err, user) {

        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, {
                message: 'Unknown user ' + username
            });
        }

        user.comparePassword(password, function(err, isMatch) {

            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({
        where: {
            id: id
        }
    }, function(err, user) {
        done(err, user);
    });
});



exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

exports.ensureOperator = function ensureOperator(req, res, next) {
    if (req.user && req.user.trust >= 2) {
        next();
    } else {
        res.send(403);
    }
};

exports.ensureAdmin = function ensureAdmin(req, res, next) {
    if (req.user && req.user.trust >= 3) {
        next();
    } else {
        res.send(403);
    }
};