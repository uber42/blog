var express = require('express');
var passport = require('passport');
var middleware = require('../controllers/middleware');
var router = express.Router();

router.get('/', middleware.isAuth, function(req, res) {
    req.session.destroy(err => {
        res.redirect('/1');
    });
});

module.exports = router;
