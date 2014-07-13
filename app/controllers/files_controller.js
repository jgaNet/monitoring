var events = require('events');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require('fs');
var db = mongoose.connection.db;
var gfs = Grid(db, mongoose.mongo);
var settings = require("../../settings");

var File = require("../models/file");

function FilesController() {};


FilesController.prototype.saveOnDatabase = function(req, res) {
    var controller = this;
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var gfstream;
        gfstream = gfs.createWriteStream({
            filename: filename,
            content_type: mimetype,
            mode: 'w'
        });

        events(file, gfstream, res);
    });
};

FilesController.prototype.saveOnFileSystem = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var fileUpload = new File({
            name: filename,
            path: settings.uploadFolder
        });

        fileUpload.save();
        var fstream = fs.createWriteStream(settings.uploadFolder + filename);
        events(file, fstream, res);
    });
};


FilesController.prototype.downloadOnDatabase = function(req, res) {
    gfs.exist({
        filename: req.query.filename
    }, function(err, found) {
        if (err) {
            res.send(err);
            return;
        }
        if (!found) {
            res.send("File not found");
        } else {
            var file = gfs.createReadStream({
                filename: req.query.filename
            });

            res.set('Content-disposition', 'attachment; filename=' + req.query.filename);
            res.set("Content-Type", "application/octet-stream");

            file.pipe(res);
        }
    });
};

FilesController.prototype.downloadOnFileSystem = function(req, res) {
    var file = settings.uploadFolder + req.query.filename;
    fs.exists(file, function(exist) {
        if (exist) {
            res.download(file);
        } else {
            res.send("File not found");
        }
    });
};

var events = function(file, stream, res) {
    var controler = this;
    file.pipe(stream);

    stream.on('error', function(error) {
        console.log(error);
    });

    stream.on('close', function() {
        res.redirect("back");
    });
};

module.exports = new FilesController();