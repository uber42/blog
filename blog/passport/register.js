const db = require('../models');
const LocalStrategy = require('passport-local').Strategy;
const Joi = require('joi');

module.exports = function (passport) {
  passport.use('signup', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async function(req, email, password, done) {
      const schema = Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/),
        name: Joi.string().min(4).max(35)
      });

      try {
        const valid = await Joi.validate({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name
        }, schema);

        const user = await db.user.findOne({
          where: {
            email : email
          }
        });

        if(user) {
          return done(null, false, req.flash('message', 'Этот e-mail уже занят'));
        }
        if(req.body.password_confirmation !== req.body.password) {
          return done(null, false, req.flash('message', 'Пароли не совпадают'));
        }
        const data = {
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
        };
        const result = await db.user.create(data);
        return done(null, result);
      } catch (err) {
        return done(null, false, req.flash('message', err.message));
      }
    },
  ));
};
