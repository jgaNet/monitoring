var router   = require('express').Router();
var mongoose = require('mongoose');
var db       = mongoose.connection.db;


var findAllVariables = function(callback) {
    db.collection('variables', {}, function(err, collection){
        collection.find().toArray(callback);
    });
};

router.get('/', function(req, res) {
    findAllVariables(function(err, variables){
        res.render('index', { 
            variables:  JSON.stringify(variables)
        });
    });
});

router.get('/monitor', function(req, res) {
   findAllVariables(function(err, variables){
        res.render('monitor', { 
            variables:  JSON.stringify(variables)
        });
    });
});



module.exports = router;