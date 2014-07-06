var mongoose = require('mongoose');

var variableSchema = new mongoose.Schema({
    name: String,
    value: Number
});
var variableModel = mongoose.model('Variable', variableSchema);

variableModel.remove({}, function(err){
    console.log('collection remove');
});


function Variable (name, value) {
    this.model = new variableModel({
        name : name,
        value : value
    });

    this.model.save(function(err, variable){
        if(err) return console.error(error);
    });
};

Variable.prototype.update = function(value) {
    this.model.value = value;
    this.model.save();
};

var createVariable = function (name, value) {
    return new Variable(name, value);
};

module.exports = createVariable;