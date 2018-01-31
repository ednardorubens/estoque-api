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
// app.use(logger(':method :url :status :res[content-length]kb :response-time ms | [:date :remote-user :remote-addr]'));

const format = (tokens, req, res) => {
  const status = res.statusCode;
  
  const colorStatus = status >= 500 ? 31 // red
    : status >= 400 ? 33 // yellow
    : status >= 300 ? 36 // cyan
    : status >= 200 ? 32 // green
    : 0 // no color

  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6

  const colorResponseTime = ms >= 3000 ? 31 // red
    : ms >= 2000 ? 33 // yellow
    : ms >= 1000 ? 34 // blue
    : 32 // green

  var fn = logger.compile('\x1b[42m\x1b[30m[:method]\x1b[0m \x1b[34m:url \x1b[' + colorStatus + 'm:status \x1b[35m:res[content-length] \x1b[' + colorResponseTime + 'm:response-time ms \x1b[37m[:date :remote-user :remote-addr]\x1b[0m');
  
  return fn(tokens, req, res);
};

app.use(logger(format));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;