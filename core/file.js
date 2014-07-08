var events   = require('events');
var mongoose = require('mongoose');
var Grid     = require('gridfs-stream');
var fs       = require('fs');
var db       = mongoose.connection.db;
var gfs      = Grid(db, mongoose.mongo);;
var settings = require("../settings");

var fileSchema = new mongoose.Schema({
                    name: String,
                    path: String
                });

var fileModel = mongoose.model('File', fileSchema);


function File (name, file, mimetype, onDataBase) {
    this.name = name;
    this.onDataBase= onDataBase; 
    this.file = file; 
    this.mimetype = mimetype;
}

File.prototype.__proto__ = events.EventEmitter.prototype;


File.prototype.save = function () {
    if(this.onDataBase){
        this.saveOnDatabase()
    }else{
        this.saveOnSystem();
    }
};

File.prototype.saveOnSystem = function () {
    this.saveReferenceOnDatabase();
    var fstream = fs.createWriteStream(settings.uploadFolder + this.name);

    this.events(fstream);
};

File.prototype.saveReferenceOnDatabase = function () {
    var fileUpload = new fileModel({
        name : this.name,
        path : settings.uploadFolder
    });

    fileUpload.save();
};


File.prototype.saveOnDatabase = function () {
    var gfstream;

    gfstream = gfs.createWriteStream({
        filename : this.name,
        content_type: this.mimetype,
        mode: 'w'
    });
        
    this.events(gfstream);
};



File.prototype.events = function (stream) {
    var file = this;
    this.file.pipe(stream);

    stream.on('error', function (error) {
        file.emit("error");
    });

    stream.on('close', function () {
        file.emit("close");
    });
};

module.exports = File;