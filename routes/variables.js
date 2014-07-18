var router = require('express').Router();
var pass = require('../server/libs/passport');
var variablesController = require("../server/controllers/variables_controller");

router.all('/', pass.ensureOperator);

router.post('/:id/exec', variablesController.exec);

module.exports = router;