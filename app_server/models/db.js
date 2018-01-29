const mongoose = require('mongoose');
const location = require('./locations');

module.exports = (() => {
  const connect = (uri, options) => {
    const conn = mongoose.createConnection(uri, options)
      .on('connected', () => console.log('Mongoose connected to ' + uri))
      .on('error', (error) => console.log('Mongoose connection error: ' + error))
      .on('disconnected', () => console.log('Mongoose disconnected of ' + uri));
    
    const gracefulShutdown = (msg) => {
      console.log('Mongoose disconnected through ' + msg);
      conn.close(() => process.exit(0));
    };
    
    process.on('SIGINT', () => gracefulShutdown('app termination'))
      .on('SIGTERM', () => gracefulShutdown('heroku termination'));
  }

  return {
    connect: (uri, options) => connect(uri, options),
  };
})();