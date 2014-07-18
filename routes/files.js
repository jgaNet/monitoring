var router = require('express').Router();
var pass = require('../server/libs/passport');
var filesController = require("../server/controllers/files_controller");

router.all('/', pass.ensureAuthenticated);

router.post('/sys_upload', pass.ensureOperator, filesController.save);

router.get('/sys_download', filesController.download);

module.exports = router;