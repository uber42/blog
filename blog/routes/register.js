var express = require('express');
var passport = require('passport');
var middleware = require('../controllers/middleware');
var router = express.Router();

router.get('/', middleware.notAuth,function(req, res) {
    res.render('register', {error : req.flash('message')});
});
  
router.post('/', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash : true 
}));

module.exports = router;
