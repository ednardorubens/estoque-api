var path = require('path');
var logger = require('morgan');
var helmet = require('helmet');
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var RedisStore = require('connect-redis')(session);

// Conectar no banco de dados antes de iniciar o Express
require('./app_server/models/db').connect();

var app = express();

app.use(require('./app_server/filters/cors'));

// Security
app.use(helmet());

// Session Security
app.set('trust proxy', 1);

const sessionOptions = {
  resave: false,
  name: 'sessionId',
  secret: '5up37_s3Cur3',
  saveUninitialized: false,
  cookie: {
    path: 'estoque/api',
    maxAge: 60 * 60 * 1000,
    // domain: 'localhost',
  },
}
if (process.env.NODE_ENV === 'production') {
  sessionOptions.store = new RedisStore({
    logErrors: true,
    pass: process.env.REDIS_PASS,
    url: process.env.REDIS_URL,
  });
}

app.use(session(sessionOptions));
app.use(logger('[:method] :url :status :res[content-length] :response-time ms [:date :remote-user :remote-addr]'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./app_server/routes'));

module.exports = app;