var router = require('express').Router();
var mongoose = require('mongoose');
var db = mongoose.connection.db;
var pass = require('../utils/pass');

var findAllVariables = function(callback) {
    db.collection('variables', {}, function(err, collection) {
        collection.find().toArray(callback);
    });
};

router.all('/', pass.ensureAuthenticated);


router.get('/',
    function(req, res, next) {
        pass.ensureAdmin(0, req, res, next);
    },
    function(req, res) {
        findAllVariables(function(err, variables) {
            res.render('monitor', {
                variables: JSON.stringify(variables)
            });
        });
    }
);

router.get('/configs',
    function(req, res, next) {
        pass.ensureAdmin(1, req, res, next);
    },
    function(req, res) {
        findAllVariables(function(err, variables) {
            res.render('configs', {
                variables: JSON.stringify(variables)
            });
        });
    }
);

router.get("/lang/:locale", function(req, res, next) {
    req.session.locale = req.params.locale;
    if (req.headers.referer) {
        res.redirect(req.headers.referer)
    } else {
        res.redirect("/");
    }
});


module.exports = router;