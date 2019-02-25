var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('client-sessions');

// routers
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var indexRouter = require('./routes/index');
var lessonsRouter = require('./routes/lessons');
var vocabulariesRouter = require('./routes/vocabularies');
var learnRouter = require('./routes/learn');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// define some basic information
app.locals.pageTitle = 'Chinese Vocabulary';
app.locals.navigationPoints = {
	'Lektionen': '/lessons',
	'Lernen': '/learn',
	'Abmelden': '/logout'
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	cookieName: 'session',
	secret: 'ase8flLSe39slPes',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true,
	secure: true,
	ephemeral: true
}));

// if the user is not logged in redirect to login
function requireLogin(req, res, next) {
	if (!req.session.user) {
		res.redirect('/login');
	} else {
		next();
	}
};

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/', requireLogin, indexRouter);
app.use('/lessons', requireLogin, lessonsRouter);
app.use('/vocabularies', requireLogin, vocabulariesRouter);
app.use('/learn', requireLogin, learnRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;