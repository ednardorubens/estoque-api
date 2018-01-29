const mongoose = require('mongoose');

module.exports = (() => {
  const connect = (uri, options) => {
    mongoose.connect(uri, options);

    mongoose.connection
      .on('connected', () => console.log('Mongoose connected to ' + uri))
      .on('error', (error) => console.log('Mongoose connection error: ' + error))
      .on('disconnected', () => console.log('Mongoose disconnected of ' + uri));

    const gracefulShutdown = (msg) => {
      console.log('Mongoose disconnected through ' + msg);
      mongoose.connection.close(() => process.exit(0));
    };
    
    process.on('SIGINT', () => gracefulShutdown('app termination'))
      .on('SIGTERM', () => gracefulShutdown('heroku termination'));
  }

  return {
    connect: (uri, options) => connect(uri, options),
  };
})();

require('./produto');