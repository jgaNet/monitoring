var router = require('express').Router();
var pass = require('../server/libs/passport');
var variablesController = require("../server/controllers/variables_controller");
var applicationController = require("../server/controllers/application_controller");

router.all('/', pass.ensureAuthenticated);

router.get('/', variablesController.index);

router.get('/configs', pass.ensureOperator, variablesController.edit);

router.get('/login', applicationController.getlogin);

router.post('/login', applicationController.postlogin);

router.get('/logout', applicationController.logout);

router.get("/lang/:locale", function(req, res, next) {
    req.session.locale = req.params.locale;
    if (req.headers.referer) {
        res.redirect(req.headers.referer)
    } else {
        res.redirect("/");
    }
});


module.exports = router;