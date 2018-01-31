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
var cors = require('./app_server/filters/cors');

var app = express();

app.use(cors);

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

module.exports = app;