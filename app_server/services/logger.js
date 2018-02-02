var fs = require('fs');
var winston = require('winston');

const logDir = 'logs';
const env = process.env.NODE_ENV || 'development';
if (!fs.existsSync(logDir)){
  fs.mkdirSync(logDir);
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: env === 'development' ? 'debug' : 'info'
    }),
    new winston.transports.File({
      maxFiles: 10,
      level: 'error',
      colorize: false,
      maxsize: 1048576,
      filename: 'logs/errors.log',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      maxFiles: 10,
      colorize: false,
      maxsize: 1048576,
      filename: 'logs/exceptions.log',
    })
  ]
});