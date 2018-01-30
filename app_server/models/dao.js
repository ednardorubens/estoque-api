const mongoose = require('mongoose');

module.exports = (tipo) => {
  const Model = mongoose.model(tipo);
  
  const _regCall = (operation, operated, error) => {
    let status = '';
    if (!error) {
      status = tipo + ' ' + operated + '(a) com sucesso';
    } else {
      status = 'Ocorreu um erro ao tentar ' + operation + ' um(a) ' + tipo;
      const name = error.name;
      if (name === 'BulkWriteError') {
        const message = error.message;
        if (message.indexOf('duplicate key') != -1) {
          let campo = message.substr(message.indexOf('index: ') + 7);
          campo = campo.substr(0, campo.indexOf('_'));

          let valor = message.substr(message.indexOf('dup key: { : "') + 14);
          valor = valor.substr(0, valor.indexOf('"'));
          status += ', pois já existe um(a) ' + tipo + ' com o ' + campo + ' "' + valor + '"';
        }
      } else if (name === 'ValidationError') {
        let message = '' + error;
        message = message.replace(new RegExp("(\\w)*: ", "g"), "");
        message = message.replace(new RegExp("Cast to Number failed for value", "g"), "Falha na conversão do número");
        message = message.replace(new RegExp("Cast to Date failed for value", "g"), "Falha na conversão da data");
        message = message.replace(new RegExp("at path", "g"), "para o campo");
        message = message.replace(new RegExp(", ", "g"), ",\n  - ");
        status += ' (\n  - ' + message + '\n)';
      }
    }
    return status + '.';
  };

  const _regCallback = (callback, operation, operated, error) => {
    if (callback) {
      callback(_regCall(operation, operated, error));
    } else {
      console.log(_regCall(operation, operated, error));
    }
  }

  return (() => {
    return {
      listar    : () => Model.find(),
      buscar    : (id) => Model.findById(id),
      inserir   : (dados, callback) => new Model(dados).save((error) => _regCallback(callback, 'criar', 'criado', error)),
      atualizar : (id, dados, callback) => Model.findByIdAndUpdate(id, dados, (error) => _regCallback(callback, 'atualizar', 'atualizado', error)),
      remover   : (id, callback) => Model.findByIdAndRemove(id, {}, (error) => _regCallback(callback, 'remover', 'removido', error)),
    }
  })();
}