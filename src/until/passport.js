const LocalStrategy = require('passport-local').Strategy
const User = require('../app/models/user')
const bcrypt = require('bcrypt')

module.exports = function(passport) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false,{message:'Không có tài khoản này'}); }
            bcrypt.compare(password, user.password, function(err, result) {
                if (err) { return done(err); }
                if(result){
                    return done(null, user)
                }else {
                    return done(null, false,{message:'Tài khoản mật khẩu không đúng'})
                }

            });
          });
        }
        


    ));
    
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
}