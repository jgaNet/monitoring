var express = require('express');
var router = express.Router();
var passport = require('passport');
var session_middleware = require('../core/session_middleware');


/* GET users listing. */
router.get('/', session_middleware.getlogin);

// Login pages
router.get('/login', session_middleware.getlogin);
router.post('/login', session_middleware.postlogin);
router.get('/logout', session_middleware.logout);

// secure pages
router.get('/account', session_middleware.account);

//admin pages
router.get('/admin', session_middleware.admin);

module.exports = router;
