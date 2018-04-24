var getPostById = require('../controllers/article').getPostById;

module.exports.notAuth = (req, res, next) => {
    if(req.isAuthenticated()){
        res.redirect('/1');
    } else {
        next();
    }
}    

module.exports.isAuth = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/1');
    } else {
        next();
    }
}    

module.exports.isAuthAPI = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.status(203).send('Вы не авторизованны');
    } else {
        next();
    }
}    

module.exports.AdminOrCreator = async (req, res, next) => {
    var post = await getPostById(req);
    if(req.user.admin || req.user.id === (post).user.id){
        req.article = post
        next();
    } else {
        res.redirect('/1');
    }
}

module.exports.AdminOrCreatorAPI = async (req, res, next) => {
    var post = await getPostById(req);
    if(req.user.admin || req.user.id === (post).user.id){
        req.article = post
        next();
    } else {
        res.send('Вы не являетесь создателем данной статьи.')
    }
}
