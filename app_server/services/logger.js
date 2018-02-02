var fs = require('fs');
var winston = require('winston');

module.exports = (() => {
  const _config = () => {
    const logDir = 'logs';
    const env = process.env.NODE_ENV || 'development';
    if (!fs.existsSync(logDir)){
      fs.mkdirSync(logDir);
    }
    
    winston.configure({
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
          timestamp: false,
          maxsize: 1048576,
          filename: 'logs/exceptions.log',
        })
      ]
    });
  };

  return {
    config: () => _config(),
  };
})();