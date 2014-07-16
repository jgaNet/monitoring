var router = require('express').Router();
var pass = require('../server/libs/passport');
var applicationController = require('../server/controllers/application_controller');
var userController = require("../server/controllers/users_controller");

router.get('/account', pass.ensureAuthenticated, userController.account);

router.get('/', pass.ensureAdmin, userController.index);

router.get('/show/:id', pass.ensureAdmin, userController.show);

router.get('/edit/:id', pass.ensureAdmin, userController.edit);

router.post('/edit', pass.ensureAdmin, userController.update);

router.get('/delete/:id', pass.ensureAdmin, userController.delete);

router.get('/new', pass.ensureAdmin, userController.new);

router.post('/new', pass.ensureAdmin, userController.create);

module.exports = router;