var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var fs       = require('fs');
var Grid     = require('gridfs-stream');
var db       = mongoose.connection;
var gfs      = Grid(db.db, mongoose.mongo);;
var settings = require("../settings");
var i18n     = require('i18n');


var fileSchema = new mongoose.Schema({
                    name: String,
                    path: String
                });

var fileModel = mongoose.model('File', fileSchema);


router.get('/', function(req, res) {
    mongoose.connection.db.collection('variables', {}, function(err, collection){
        collection.find().toArray(function(err, variables){
            res.render('index', { variables:  JSON.stringify(variables)});
        });
    });
});

router.get('/monitor', function(req, res) {
    mongoose.connection.db.collection('variables', {}, function(err, collection){
        collection.find().toArray(function(err, variables){
            res.render('monitor', { title: i18n.__('monitor'), variables:  JSON.stringify(variables)});
        });
    });
});

router.post('/sys_upload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        var path = settings.dirname+'/public/files/';
        
        var fileUpload = new fileModel({
            name : filename,
            path : path
        });
        fileUpload.save();

        fstream = fs.createWriteStream(path + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
});

router.post('/db_upload', function(req, res) {
    var gfstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        gfstream = gfs.createWriteStream({
            filename : filename,
            content_type: mimetype,
            mode: 'w'
        });
        
        file.pipe(gfstream);

        gfstream.on('error', function (error) {
            console.log(error)
        });

        gfstream.on('close', function () {
            res.redirect('back');
        });
    });
});

router.get('/sys_download', function(req, res){
  var file = settings.dirname + '/public/files/'+req.query.filename;
  res.download(file); 
});

router.get('/db_download', function(req, res){
    var file = gfs.createReadStream({
        filename: req.query.filename
    })

    file.pipe(res);
});

router.get("/lang/:locale", setLocale);

function setLocale(req, res, next){
    req.session.locale = req.params.locale;
    if(req.headers.referer) res.redirect(req.headers.referer);
    else res.redirect("back");
}




module.exports = router;