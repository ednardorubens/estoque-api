const winston = require('winston');

const logDir = 'logs';
const env = process.env.NODE_ENV || 'development';

let exceptionHandlers = [new winston.transports.Console()]

winston.configure({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: env === 'development' ? 'debug' : 'info'
    }),
  ],
  exceptionHandlers: exceptionHandlers
});