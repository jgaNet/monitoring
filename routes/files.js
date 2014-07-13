var router = require('express').Router();
var pass = require('../libs/passport');
var filesController = require("../app/controllers/files_controller");

router.all('/', pass.ensureAuthenticated);

router.post('/sys_upload', pass.ensureOperator, filesController.saveOnFileSystem);

router.post('/db_upload', pass.ensureOperator, filesController.saveOnDatabase);

router.get('/sys_download', filesController.downloadOnFileSystem);

router.get('/db_download', filesController.downloadOnDatabase);

module.exports = router;