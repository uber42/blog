var express = require('express');
var passport = require('passport');
var middleware = require('../controllers/middleware');
var router = express.Router();

router.get('/', middleware.notAuth, function(req, res) {
    res.render('auth', {error : req.flash('message')});
});

router.post('/', passport.authenticate('signin', {
    successRedirect: '/1',
    failureRedirect: '/auth',
    failureFlash : true 
}));

module.exports = router;
