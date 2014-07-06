var router   = require('express').Router();
var mongoose = require('mongoose');
var db       = mongoose.connection.db;

router.get('/new', function(req, res) {
    res.render('sessions/new');
});

router.post('/login', function(req, res) {
    res.render('sessions/new');
});



module.exports = router;