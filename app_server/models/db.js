const mongoose = require('mongoose');

// const uri = 'mongodb://ds117128.mlab.com:17128/cerejeiradb';
const uri = 'mongodb://cluster0-shard-00-00-sutcb.mongodb.net:27017,cluster0-shard-00-01-sutcb.mongodb.net:27017,cluster0-shard-00-02-sutcb.mongodb.net:27017/cerejeiradb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
const options = {user: 'cerejeira', pass: 'cerejeira@123'};

module.exports = (() => {
  const connect = () => {
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
    connect: () => connect(),
  };
})();

mongoose.Error.messages.general.default = 'A validação falhou para o campo "{PATH}" com valor "{VALUE}"';
mongoose.Error.messages.general.required = 'O campo "{PATH}" é obrigatório';

mongoose.Error.messages.Number.min = 'O valor "{VALUE}" inserido no campo "{PATH}" é menor que o mínimo({MIN}) permitido';
mongoose.Error.messages.Number.max = 'O valor "{VALUE}" inserido no campo "{PATH}" é maior que o máximo({MAX}) permitido';

mongoose.Error.messages.Date.min = 'O valor "{VALUE}" inserido no campo "{PATH}" é anterior ao mínimo({MIN}) permitido';
mongoose.Error.messages.Date.max = 'O valor "{VALUE}" inserido no campo "{PATH}" é posterior ao máximo({MAX}) permitido';

mongoose.Error.messages.String.enum = '"{VALUE}" não é um valor válido para o campo "{PATH}"';
mongoose.Error.messages.String.match = '"{VALUE}" não é um valor válido para o campo "{PATH}"';
mongoose.Error.messages.String.minlength = 'O tamanho do valor "{VALUE}" inserido no campo "{PATH}" é menor que o mínimo({MINLENGTH}) permitido';
mongoose.Error.messages.String.maxlength = 'O tamanho do valor "{VALUE}" inserido no campo "{PATH}" é maior que o máximo({MAXLENGTH}) permitido';

require('./produto');