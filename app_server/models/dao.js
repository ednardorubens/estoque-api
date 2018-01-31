const mongoose = require('mongoose');

module.exports = (tipo) => {
  const Model = mongoose.model(tipo);
  
  const _regCall = (operation, operated, error) => {
    let erro = '';
    if (error) {
      erro = 'Ocorreu um erro ao tentar ' + operation + ' um(a) ' + tipo;
      const name = error.name;
      if (name === 'BulkWriteError' || name === 'MongoError') {
        const message = error.message;
        if (message.indexOf('duplicate key') != -1) {
          let campo = message.substr(message.indexOf('index: ') + 7);
          campo = campo.substr(0, campo.indexOf('_'));

          let valor = message.substr(message.indexOf('dup key: { : "') + 14);
          valor = valor.substr(0, valor.indexOf('"'));
          erro += ", pois já existe um(a) " + tipo + " com o " + campo + " '" + valor + "'";
        }
      } else if (name === 'ValidationError') {
        let message = '' + error;
        message = message.replace(new RegExp("(\\w)*: ", "g"), "");
        message = message.replace(new RegExp("Cast to Number failed for value", "g"), "Falha na conversão do número");
        message = message.replace(new RegExp("Cast to Date failed for value", "g"), "Falha na conversão da data");
        message = message.replace(new RegExp("at path", "g"), "para o campo");
        erro += ' (' + message + ')';
      } else {
        console.log(error);
      }
      erro += '.';
    }
    return erro;
  };

  const _regCallback = (callback, operation, operated, error, itens) => {
    if (callback) {
      callback(_regCall(operation, operated, error), itens);
    } else {
      console.log(_regCall(operation, operated, error));
    }
  }

  return (() => {
    return {
      listar    : () => Model.find(),
      buscar    : (id) => Model.findById(id),
      inserir   : (dados, callback) => Model.create(dados, (error, itens) => _regCallback(callback, 'criar', 'criado', error, itens)),
      atualizar : (id, dados, callback) => Model.findByIdAndUpdate(id, dados, (error, itens) => _regCallback(callback, 'atualizar', 'atualizado', error, itens)),
      remover   : (id, callback) => Model.findByIdAndRemove(id, (error) => _regCallback(callback, 'remover', 'removido', error)),
    }
  })();
}