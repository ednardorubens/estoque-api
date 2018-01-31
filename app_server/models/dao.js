const mongoose = require('mongoose');

module.exports = (() => (tipo, masc = true) => {
  const Model = mongoose.model(tipo);
  
  const _regCall = (operation, error) => {
    let erro = '';
    if (error) {
      erro = 'Ocorreu um erro ao tentar ' + operation + ' um' + (masc ? '' : 'a') + ' ' + tipo;
      const name = error.name;
      if (name === 'BulkWriteError' || name === 'MongoError') {
        const message = error.message;
        if (message.indexOf('duplicate key') != -1) {
          let campo = message.substr(message.indexOf('index: ') + 7);
          campo = campo.substr(0, campo.indexOf('_'));

          let valor = message.substr(message.indexOf('dup key: { : "') + 14);
          valor = valor.substr(0, valor.indexOf('"'));
          erro += ", pois já existe um" + (masc ? "" : "a") + " " + tipo + " com o " + campo + " '" + valor + "'.";
        }
      } else if (name === 'ValidationError' || name === 'CastError') {
        let message = '' + error;
        message = message.replace(new RegExp("(\\w)*: ", "g"), "");
        message = message.replace(new RegExp("Cast to ObjectI[d|D] failed for value", "g"), "Falha na conversão do valor");
        message = message.replace(new RegExp("Cast to Number failed for value", "g"), "Falha na conversão do número");
        message = message.replace(new RegExp("Cast to Date failed for value", "g"), "Falha na conversão da data");
        message = message.replace(new RegExp("at path", "g"), "para o campo");
        message = message.replace(new RegExp("for model", "g"), "do objeto");
        message = message.replace(new RegExp("\"", "g"), "'");
        erro += ' (' + message + ').';
      } else {
        erro = error;
      }
    }
    return erro;
  };

  const _regCallback = (callback, operation, error, itens) => {
    if (callback) {
      callback(_regCall(operation, error), itens);
    } else {
      console.log(_regCall(operation, error));
    }
  }

  return {
    listar    : (callback) => Model.find((error, itens) => _regCallback(callback, 'listar', error, itens)),
    buscar    : (id, callback) => Model.findById(id, (error, item) => _regCallback(callback, 'buscar', error, item)),
    inserir   : (item, callback) => Model.create(item, (error, itens) => _regCallback(callback, 'criar', error, itens)),
    atualizar : (id, dados, callback) => Model.findByIdAndUpdate(id, dados, (error, item) => _regCallback(callback, 'atualizar', error, item)),
    remover   : (id, callback) => Model.findByIdAndRemove(id, (error, item) => _regCallback(callback, 'remover', error, item)),
  }
})();