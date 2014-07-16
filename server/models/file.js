var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
    name: String,
    path: String
});


var File = mongoose.model('File', fileSchema);
module.exports = File;