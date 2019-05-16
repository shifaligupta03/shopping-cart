const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports= function(passport){
    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, {message : 'No user found'}); }

            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) console.log(err);
                if(isMatch){
                    return done(null, user);
                } else{
                    return done(null, false, {message : 'Wrong Password.'});
                }
            })

            // if (!user.verifyPassword(password)) { return done(null, false); }
            // return done(null, user);
          });
        }
      ));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(user, done){
        User.findById(id, function(err, user){
            done(null, user);
        });
    });

}