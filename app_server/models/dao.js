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

  return (() => {
    return {
      inserir: (dados, callback) => {
        const model = new Model(dados);
        model.save((error) => {
          if (callback) {
            callback(_regCall('criar', 'criado', error));
          }
        });
      },

      listar: () => Model.find(),

      remover: (dados, callback) => {
        let removed = Model.remove(dados, (error) => _regCall('remover', 'removido', error));
        if (removed && callback) {
          removed.then(callback);
        }
      },
    }
  })();
};