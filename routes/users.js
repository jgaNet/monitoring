var router = require('express').Router();
var pass = require('../libs/passport');
var applicationController = require('../app/controllers/application_controller');
var userController = require("../app/controllers/users_controller");

router.get('/login', applicationController.getlogin);

router.post('/login', applicationController.postlogin);

router.get('/logout', applicationController.logout);

router.get('/account', pass.ensureAuthenticated, applicationController.account);

router.get('/', pass.ensureAdmin, userController.index);

router.get('/show/:id', pass.ensureAdmin, userController.show);

router.get('/edit/:id', pass.ensureAdmin, userController.edit);

router.post('/edit', pass.ensureAdmin, userController.update);

router.get('/delete/:id', pass.ensureAdmin, userController.delete);

router.get('/new', pass.ensureAdmin, userController.new);

router.post('/new', pass.ensureAdmin, userController.create);

module.exports = router;