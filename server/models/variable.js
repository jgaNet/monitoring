var mongoose = require('mongoose');

var variableSchema = new mongoose.Schema({
    name: String,
    value: Number
});

var Variable = mongoose.model('Variable', variableSchema);

module.exports = Variable;