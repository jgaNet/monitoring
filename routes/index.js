var router = require('express').Router();
var mongoose = require('mongoose');
var db = mongoose.connection.db;
var pass = require('../libs/passport');
var variablesController = require("../app/controllers/variables_controller");

router.all('/', pass.ensureAuthenticated);

router.get('/', variablesController.index);

router.get('/configs', pass.ensureOperator, variablesController.edit);

router.get("/lang/:locale", function(req, res, next) {
    req.session.locale = req.params.locale;
    if (req.headers.referer) {
        res.redirect(req.headers.referer)
    } else {
        res.redirect("/");
    }
});


module.exports = router;