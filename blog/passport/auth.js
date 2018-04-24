let db = require('../models');
let LocalStrategy = require('passport-local').Strategy;
let Joi = require('joi');

module.exports = function (passport) {
  passport.use('signin', new LocalStrategy(
{
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async function(req, email, password, done) {
        try {
            var user = await db.user.findOne({
                where: {
                    email : email
                }
            });
            if(!user){
                return done(null, false, req.flash('message', 'Неправильный email'));
            } 
                if(!user.PassIsEquals(password)) {
                    return done(null, false, req.flash('message', 'Неправильный пароль'));
                } else {
                    return done(null, user.get());
                }
            
        } catch(err) {
            return done(null, false, req.flash('message', err.message));
        }
    }
));
};
