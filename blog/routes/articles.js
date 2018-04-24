var express = require('express');
var router = express.Router();
var models = require('../models');
var articleControllers = require('../controllers/article');
var middleware = require('../controllers/middleware');
var path = require('path');

router.get('/new', middleware.isAuth, function(req, res) {
    var article = {title: "", description: "", text: ""}
    res.render('article-create', {
        isAuth : true,
        name : req.user.name,
        article : article,
        button : 'Создать',
        error : req.flash('message'),
        curUserId : req.user.id
    });
});

router.post('/new', middleware.isAuth, async (req, res) => {
    var result = await articleControllers.createPost(req)
    if(!result) {
        res.redirect('/post/new');
    } else {
        res.redirect(`/post/${result.id}`);
    }
});

router.get('/:id', async (req, res) => {
    var result = await articleControllers.getPostById(req);
    if(result) {
        var isAuth = req.isAuthenticated();
        await res.render('article-page', {
            isAuth: isAuth,
            name : (isAuth) ? req.user.name : null,
            curUserId: (isAuth) ? req.user.id : null,
            article: result,
            main : false
        });
    } else {
        res.redirect('/1')
    }
});

router.get('/:id/edit', middleware.isAuth, middleware.AdminOrCreator, async (req, res) => {
    await res.render('article-create', {
        article : req.article,
        isAuth : true, 
        name : req.user.name,
        error : req.flash('message'),
        button: 'Изменить',
        curUserId: req.user.id
    });
});

router.post('/:id/edit', middleware.isAuth, middleware.AdminOrCreator, async (req, res) => {
    var result = await articleControllers.updatePost(req);
    if(result){
        res.redirect(`/post/${req.params.id}`);
    } else {
        res.redirect(`/post/${req.params.id}/edit`);
    }
});

router.get('/:id/delete', middleware.isAuth, middleware.AdminOrCreator, async (req, res) => {
    await articleControllers.deletePost(req);
    res.redirect('/1');
});

module.exports = router;