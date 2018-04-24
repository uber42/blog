var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
var db = require('./models');


var routes = require('./routes/index');
var register = require('./routes/register');
var auth = require('./routes/auth');
var signout = require('./routes/signout');
var profile = require('./routes/profile');
var articles = require('./routes/articles');
var api = require('./routes/api');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev')); 
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat',resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    db.user.findById(id).then(user => {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});

app.use('/register', register);
app.use('/auth', auth);
app.use('/signout', signout);
app.use('/profile', profile);
app.use('/post', articles);
app.use('/api', api)
app.use('/', routes);

require("./passport/register")(passport);
require("./passport/auth")(passport);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}); 

app.set('port', 3000); 

db.sequelize.authenticate();

var start = () => {
    db.sequelize
    .sync()
    .then(() => {
        app.listen(app.get('port'), function() {
            console.log('Listen');
        });
    })
    .catch(err => {
        console.error(err);
    });
}

setTimeout(start, 1000);