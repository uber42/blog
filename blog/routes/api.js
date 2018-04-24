var express = require('express');
var router = express.Router();
var middleware = require('../controllers/middleware');
var articleControllers = require('../controllers/article');
var userControllers = require('../controllers/user')

router.get('/article/get/:id', async (req, res) => {
    if(req.params.id === 'all'){
        posts = await articleControllers.getAll();
        if(posts){
            res.json(posts)
        } else {
            res.send('Статьи с таким id не существует');
        }
    } else {
        post = await articleControllers.getPostById(req, false);
        if(!post){
            res.send('Статьи с таким id не существует');
        } else {
            res.json(post);
        }
    }
});

router.post('/article/create', middleware.isAuthAPI, async (req, res) => {
    var result = await articleControllers.createPost(req)
    if(!result) {
        res.send(req.flash('message'));
    } else {
        res.end('Успешно');
    }
});

router.post('/article/update/:id', middleware.isAuthAPI, middleware.AdminOrCreatorAPI, async (req, res) => {
    var result = await articleControllers.updatePost(req);
    if(result){
        res.send('Изменения внесены')
    } else {
        res.send(req.flash('message'));
    }
});

router.delete('/article/delete/:id', middleware.isAuthAPI, middleware.AdminOrCreatorAPI, async (req, res) => {
    var result = await articleControllers.deletePost(req);
    if(result){
        res.send('Успешно удалено');
    } else {
        res.send('Статьи с таким id не существует')
    }
});

router.get('/profile',middleware.isAuthAPI, async (req, res) => {
    res.json(req.user);
});

router.get('/user/:id', async (req, res) => {
    var user = await userControllers.findUserById(req);
    if(user){
        res.json(user)
      } else {
        res.send('Пользователя с таким ID нет');
      }
})

router.get('/article/last', async (req, res) => {
    var result = await articleControllers.getLastPost()
    if(result){
        res.json(result)
    } else {
        res.send('Ошибка')
    }
})

module.exports = router;