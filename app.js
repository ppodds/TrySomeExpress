var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');
const keys = require('./config/keys');
var passport = require('passport');
const User = require('./db_models/User');

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var signinRouter = require('./routes/signin');
var logoutRouter = require('./routes/logout');
var articlesRouter = require('./routes/articles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'session',
  secret: 'drlwmqnbsktgfdpnodywzqabbmstmxueyespvqopraqjegmupqlshzwdczflfgjlxercybjhkhragbpfidlqpwuyhkozaszipcydhdiiswlyfumcgoodkbloaommnxig',
  resave: 'false',
  saveUninitialized: 'false'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(keys.DBURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('[MongoDB] 資料庫連線成功!');
});

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//router
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/logout', logoutRouter);
app.use('/articles', articlesRouter);

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
