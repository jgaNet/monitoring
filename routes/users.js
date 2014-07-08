var express            = require('express');
var router             = express.Router();
var session_middleware = require('../utils/session_middleware');
var pass               = require('../utils/pass');
var userModel          = require('../utils/user_schema').userModel;
var mongoose           = require('mongoose');
var db                 = mongoose.connection.db;
/* GET users listing. */

router.get('/login', session_middleware.getlogin);
router.post('/login', session_middleware.postlogin);
router.get('/logout', session_middleware.logout);
router.get('/account', pass.ensureAuthenticated, session_middleware.account);


router.get('/',
    function(req, res, next){
        pass.ensureAdmin(2, req, res, next);
    }, 
    function(req, res) {
        db.collection('users', {}, function(err, collection){
            collection.find().toArray(function(err, users) {
                res.render('users/index', { 
                    users:  JSON.stringify(users)
                });
            });
        });
    }
);

router.get('/show/:id',
    function(req, res, next){
        pass.ensureAdmin(2, req, res, next);
    }, 
    function(req, res) {
        userModel.findOne({ "_id" : req.params.id }).exec(function(err, user) {
            res.render('users/show', { 
                user:  user
            });
        });
    }
);

router.get('/edit/:id',
    function(req, res, next){
        pass.ensureAdmin(2, req, res, next);
    }, 
    function(req, res) {
        userModel.findOne({ "_id" : req.params.id }).exec(function(err, user) {
            res.render('users/edit', { 
                user:  user
            });
        });
    }
);

router.post('/edit',
    function(req, res, next){
        pass.ensureAdmin(2, req, res, next);
    }, 
    function(req, res) {
        userModel.findOne({ "_id" : req.body._id }).exec(function(err, user) {
            
            user.username = req.body.username;
            user.email = req.body.email;

            if(req.body.password !== "") {
                user.password = req.body.password;
            }

            user.trust = req.body.trust;
            user.save();

            res.render('users/show', { 
                user:  user
            });
        });
    }
);

router.get('/delete/:id',
    function(req, res, next){
        pass.ensureAdmin(2, req, res, next);
    }, 
    function(req, res) {
        userModel.findOne({ "_id" : req.params.id }).remove().exec(function(err) {
            res.redirect("/users/");
        });
    }
);

router.get('/new',
    function(req, res, next){
        pass.ensureAdmin(2, req, res, next);
    }, 
    function(req, res) {
        res.render('users/create');
    }
);

router.post('/new',
    function(req, res, next){
        pass.ensureAdmin(2, req, res, next);
    }, 
    function(req, res) {
        var newUser = new userModel({ username: req.body.username , email: req.body.email , password: req.body.password, trust: parseInt(req.body.trust, 10) });
        newUser.save();
        res.send("utilisateur créé");
    }
);

module.exports = router;
