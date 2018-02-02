var path = require('path');
var morgan = require('morgan');
var helmet = require('helmet');
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var RedisStore = require('connect-redis')(session);
var logger = require('./app_server/services/logger.js');

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
    url: process.env.REDIS_URL,
    pass: process.env.REDIS_PASS,
  });
}

app.use(session(sessionOptions));
app.use(morgan('[:method] :url :status :res[content-length] :response-time ms [:date :remote-user :remote-addr]', {
  stream: {
    write: function(mensagem){
        logger.info(mensagem);
    }
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./app_server/routes'));

module.exports = app;
