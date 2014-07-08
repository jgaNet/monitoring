var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

//******* Database schema TODO add more validation
var Schema = mongoose.Schema;

// User schema
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  trust: { type: Number, required: true }
});


// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) {
        return next();
    }

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) {
            return next(err);
        };

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});
 
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) {
            return cb(err)
        };
		cb(null, isMatch);
	});
};


//Admin création


var userModel = mongoose.model('User', userSchema);

userModel.remove({}, function(err){
    
    console.log('users remove');
    var admin = new userModel({ username: "admin" , email: "admin@test.fr" , password: "password", trust: 2 });
    admin.save();
    var operator = new userModel({ username: "operator" , email: "operator@test.fr" , password: "password", trust: 1 });
    operator.save();
    var user = new userModel({ username: "user" , email: "user@test.fr" , password: "password", trust: 0 });
    user.save();

});

exports.userModel = userModel;
