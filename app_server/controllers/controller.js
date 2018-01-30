const Dao = require('../models/dao');

module.exports = (tipo, montar) => {
  const dao = Dao(tipo);

  const _jsonResponse = (res, content) => {
    res.status(200).json(content);
  };

  const _listar = (res) => {
    dao.listar().exec((error, itens) => _jsonResponse(res, itens));
  };
  
  const _buscar = (req, res) => {
    if (req.params['id']) {
      dao.buscar(req.params['id']).exec((error, item) => {
        if (item) {
          _jsonResponse(res, item);
        } else {
          res.send(tipo + ' não encontrado(a)!');
        }
      });
    }
  };

  const _inserir = (req, res) => {
    if (req) {
      dao.inserir(montar(req), (status) => res.send(status));
    } else {
      res.send('Parâmetros(' + JSON.stringify(req.query) + ') incorretos');
    }
  }

  const _remover = (req, res) => {
    res.send('Produto removido com sucesso!');
  }

  return (() => {
    return {
      listar : (res)      => _listar(res),
      buscar : (req, res) => _buscar(req, res),
      inserir: (req, res) => _inserir(req, res),
      remover: (req, res) => _remover(req, res),
    }
  })();
}