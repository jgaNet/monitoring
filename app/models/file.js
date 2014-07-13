var mongoose = require('mongoose');
var fs = require('fs');
var Grid = require('gridfs-stream');
var db = mongoose.connection.db;
var gfs = Grid(db, mongoose.mongo);

var fileSchema = new mongoose.Schema({
    name: String,
    path: String
});


var File = mongoose.model('File', fileSchema);
module.exports = File;