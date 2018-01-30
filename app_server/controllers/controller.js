const Dao = require('../models/dao');

module.exports = (tipo, montarObjeto, buscarAntes) => {
  const dao = Dao(tipo);

  const _listar = (res) => {
    dao.listar().exec((error, itens) => res.status(200).json(itens));
  };
  
  const _buscar = (req, res) => {
    if (req.params['id']) {
      dao.buscar(req.params['id']).exec((error, item) => {
        if (item) {
          res.status(200).json(item);
        } else {
          res.send(tipo + ' não encontrado(a)!');
        }
      });
    }
  };

  const _inserir = (req, res) => {
    if (req) {
      if (buscarAntes) {
        buscarAntes(req, () => {dao.inserir(montarObjeto(req), (status) => res.send(status))});
      } else {
        dao.inserir(montarObjeto(req), (status) => res.send(status));
      }
    } else {
      res.send('Parâmetros(' + JSON.stringify(req.params) + ') incorretos');
    }
  }
  
  const _atualizar = (req, res) => {
    if (req && req.params['id']) {
      if (buscarAntes) {
        buscarAntes(req, () => {dao.atualizar(req.params['id'], montarObjeto(req), (status) => res.send(status))});
      } else {
        dao.atualizar(req.params['id'], montarObjeto(req), (status) => res.send(status));
      }
    } else {
      res.send('Parâmetros(' + JSON.stringify(req.params) + ') incorretos');
    }
  };

  const _remover = (req, res) => {
    res.send(tipo + ' removido(a) com sucesso!');
  }

  return (() => {
    return {
      listar    : (req, res) => _listar(res),
      buscar    : (req, res) => _buscar(req, res),
      inserir   : (req, res) => _inserir(req, res),
      atualizar : (req, res) => _atualizar(req, res),
      remover   : (req, res) => _remover(req, res),
    }
  })();
}