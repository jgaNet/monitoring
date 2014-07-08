var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./user_schema');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.userModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  db.userModel.findOne({ username: username }, function(err, user) {
    if (err) { 
      return done(err); 
    }

    if (!user) { 
      return done(null, false, { message: 'Unknown user ' + username }); 
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.redirect('/users/login')
};


exports.ensureAdmin = function ensureAdmin(trust, req, res, next) {
  if(req.user && req.user.trust >= trust) {
    next();
  }else{
    res.send(403);
  }            
};