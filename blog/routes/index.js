var express = require('express');
var router = express.Router();
var models = require('../models');
var article = require('../controllers/article');

router.get('/:id', async (req, res) => {
  var isAuth = req.isAuthenticated();
  var posts = await article.getPosts(req);
  var pageAmount = Math.ceil(await article.count() / 10);
  if(req.params.id <= pageAmount || pageAmount === 0){
    await res.render('index', { 
      title: 'Какой-то сайт', 
      isAuth : isAuth, 
      page : [Number(req.params.id), pageAmount], 
      name : (isAuth) ? req.user.name : null,
      curUserId : (isAuth) ? req.user.id : null,
      articles : posts,
      main : true
    });
  } else {
    res.redirect('/1');
  }
});

router.get('/', function(req, res) {
  res.redirect('/1');
});

module.exports = router;