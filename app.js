var path = require('path');
var logger = require('morgan');
var helmet = require('helmet');
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

require('./app_server/models/db').connect();
var routes = require('./app_server/routes');

var app = express();

app.use((req, res, next) => {
  if (req.headers['origin']) {
    if (req.headers['access-control-allow-headers']) {
      if (req.headers['x-requested-with']) {
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
          res.removeHeader('x-powered-by');
          res.sendStatus(403);
          return;
        }
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      }
    }
    res.header('Access-Control-Allow-Origin', req.headers['origin']);
    res.header('Access-Control-Allow-Credentials', true);
    if (req.headers['access-control-request-method']) {
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    }
  }
  next();
});

// Security
app.use(helmet());

// Session Security
app.set('trust proxy', 1);
app.use(session({
  resave: true,
  name: 'sessionId',
  secret: '5up37_s3Cur3',
  saveUninitialized: false,
  cookie: {
    path: 'estoque/api',
    maxAge: 60 * 60 * 1000,
    // domain: 'localhost',
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;