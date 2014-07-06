var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var busboy = require('connect-busboy');
var i18n = require('i18n');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

i18n.configure({
    locales: ['en', 'fr'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    cookie: 'locale'
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
        secret: 'monitoring',
        saveUninitialized: true,
        resave: true
    }
));
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);

app.use(function(req, res, next){
    console.log(req.session);
    if(req.session.locale) //check if user has changed i18n settings
        res.setLocale(req.session.locale);
    next();
})


app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
