const Dao = require('../models/dao');

module.exports = (() => {
  const unidadeDao = Dao('Unidade');

  const _jsonResponse = (res, content) => {
    res.status(200);
    res.json(content);
  };

  const _listar = (res) => {
    unidadeDao.listar().exec((error, unidades) => {
      _jsonResponse(res, unidades);
    });
  };

  const _buscar = (req, res) => {
    res.send('Buscando id: ' + req.params['id']);
  };

  const _inserir = (req, res) => {
    if (req.query.nome && req.query.sigla) {
      unidadeDao.inserir({
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
    res.send('Unidade removido com sucesso!');
  }

  return {
    listar:  (req, res) => _listar(res),
    buscar:  (req, res) => _buscar(req, res),
    inserir: (req, res) => _inserir(req, res),
    remover: (req, res) => _remover(req, res),
  };

})();