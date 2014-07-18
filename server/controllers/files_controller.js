var events = require('events');
var mongoose = require('mongoose');
var fs = require('fs');
var db = mongoose.connection.db;
var settings = require("../../settings");

var File = require("../models/file");

function FilesController() {};


FilesController.prototype.save = function(req, res) {
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



FilesController.prototype.download = function(req, res) {
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