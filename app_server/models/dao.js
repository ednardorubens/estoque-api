const mongoose = require('mongoose');

module.exports = (tipo) => {
  const Model = mongoose.model(tipo);
  
  const _regCall = (operation, operated, error) => {
    let status = '';
    if (!error) {
      status = tipo + ' ' + operated + '(a) com sucesso';
    } else {
      let errmsg = error.errmsg;
      if (errmsg.indexOf('duplicate key') != -1) {
        let campo = errmsg.substr(errmsg.indexOf('index: ') + 7);
        campo = campo.substr(0, campo.indexOf('_'));

        let valor = errmsg.substr(errmsg.indexOf('dup key: { : "') + 14);
        valor = valor.substr(0, valor.indexOf('"'));
        status = 'Ocorreu um erro ao tentar ' + operation + ' um(a) ' + tipo + ', pois já existe um(a) ' + tipo + ' com o ' + campo + ' ' + valor;
      } else {
        status = 'Ocorreu um erro ao tentar ' + operation + ' um(a) ' + tipo;
        console.log(status + ' (' + errmsg + ')');
      }
    }
    return status;
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
      listar : () => Model.find(),
      buscar : (id) => Model.findById(id),
      inserir: (dados, callback) => new Model(dados).save((error) => _regCallback(callback, 'criar', 'criado', error)),
      remover: (id, callback) => Model.findByIdAndRemove(id, {}, (error) => _regCallback(callback, 'remover', 'removido', error)),
    }
  })();
}