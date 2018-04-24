var findUserById = require('../controllers/user').findUserById;

var express = require('express');
var passport = require('passport');
var middleware = require('../controllers/middleware');
var article = require('../controllers/article');
var router = express.Router();

router.get('/:id', async (req, res) => {
  var user = await findUserById(req);
  if(user){
    res.render('profile', {
      isAuth : await req.isAuthenticated(),
      user : user,
      curUser : req.user
    });
  } else {
    res.redirect('/1');
  }
});

module.exports = router;