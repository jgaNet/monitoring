function Variable (name, value, Model) {
    this.model = new Model({
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

module.exports = Variable;