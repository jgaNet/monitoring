var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');



/* GET home page. */
router.get('/', function(req, res) {
    mongoose.connection.db.collection('variables', {}, function(err, collection){
        collection.find().toArray(function(err, variables){
            res.render('index', { title: 'Edit Variables', variables:  JSON.stringify(variables)});
        });
    });
});

router.get('/monitor', function(req, res) {
    mongoose.connection.db.collection('variables', {}, function(err, collection){
        collection.find().toArray(function(err, variables){
            res.render('monitor', { title: 'Monitor', variables:  JSON.stringify(variables)});
        });
    });
});

router.post('/exec', function(req, res) {
});

module.exports = router;
