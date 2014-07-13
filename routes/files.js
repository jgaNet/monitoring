var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var Grid = require('gridfs-stream');
var db = mongoose.connection.db;
var gfs = Grid(db, mongoose.mongo);
var settings = require("../settings");
var File = require("../core/file");
var pass = require('../utils/pass');

var upload = function(req, res, onDataBase) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var file = new File(filename, file, mimetype, onDataBase);

        file.save();

        file.on('close', function() {
            res.redirect('back');
        });

        file.on('error', function() {
            console.log(error);
        });
    });
}

router.all('/', pass.ensureAuthenticated);

router.post('/sys_upload',
    function(req, res, next) {
        pass.ensureAdmin(1, req, res, next);
    },
    function(req, res) {
        upload(req, res, false);
    }
);

router.post('/db_upload',
    function(req, res, next) {
        pass.ensureAdmin(1, req, res, next);
    },
    function(req, res) {
        upload(req, res, true);
    }
);

router.get('/sys_download',
    function(req, res, next) {
        pass.ensureAdmin(0, req, res, next);
    },
    function(req, res) {
        var file = settings.uploadFolder + req.query.filename;
        res.download(file);
    }
);

router.get('/db_download',
    function(req, res, next) {
        pass.ensureAdmin(0, req, res, next);
    },
    function(req, res) {
        var file = gfs.createReadStream({
            filename: req.query.filename
        })

        res.set('Content-disposition', 'attachment; filename=' + req.query.filename);
        res.set("Content-Type", "application/octet-stream");

        file.pipe(res);
    }
);



module.exports = router;