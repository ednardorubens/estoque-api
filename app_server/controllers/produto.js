const Dao = require('../models/dao');

module.exports = (() => {
  const produtoDao = Dao('Produto');

  const _jsonResponse = (res, content) => {
    res.status(200);
    res.json(content);
  };

  const _listar = (res) => {
    produtoDao.listar().exec((error, produtos) => {
      _jsonResponse(res, produtos);
    });
  };

  const _buscar = (req, res) => {
    res.send('Buscando id' + req.param.id);
  };

  const _inserir = (req, res) => {
    if (req.query.nome && req.query.sigla) {
      produtoDao.inserir({
        nome: req.query.nome,
        sigla: req.query.sigla,
      }, (status) => {
        res.send(status);
      });
    } else {
      res.send('Parâmetros(' + JSON.stringify(req.query) + ') incorretos');
    }
  }

  const _remover = (req, res) => {
    res.send('Produto removido com sucesso!');
  }

  return {
    listar:  (req, res) => _listar(res),
    buscar:  (req, res) => _buscar(req, res),
    inserir: (req, res) => _inserir(req, res),
    remover: (req, res) => _remover(req, res),
  };

})();