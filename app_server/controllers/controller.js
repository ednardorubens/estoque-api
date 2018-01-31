const Dao = require('../models/dao');

module.exports = (tipo, mapear) => {
  const dao = Dao(tipo);

  const _listar = (res, mensagem) => dao.listar().exec((erro, itens) => {
    if (erro) {
      res.status(404).json({'erro': 'Nenhum ' + tipo + ' foi encontrado(a)!'});
    } else {
      res.status(200).json(itens);
    }
  });
  
  const _buscar = (req, res) => {
    if (req.params.id) {
      dao.buscar(req.params.id).exec((erro, item) => {
        if (item) {
          res.status(200).json(item);
        } else {
          res.status(404).json({'erro': tipo + ' não encontrado(a)!'});
        }
      });
    }
  };

  const _inserirNoRepositorio = (req, res) => dao.inserir(req.body, (erro, item) => {
    if (erro) {
      res.status(400).json({'erro': erro});
    } else {
      res.status(201).location(req.path + '/' + item._id).json({
        'mensagem': tipo + ' salvo(a) com sucesso!',
        'item': item,
      });
    }
  });
  
  const _inserir = (req, res) => {
    if (req && req.body && res) {
      if (mapear) {
        mapear(req.body, _inserirNoRepositorio(req, res));
      } else {
        _inserirNoRepositorio(req, res);
      }
    }
  }
  
  const _atualizarNoRepositorio = (req, res) => dao.atualizar(req.params.id, req.body, (erro, item) => {
    if (erro) {
      res.status(400).json({'erro': erro});
    } else {
      res.status(200).json({
        'mensagem': tipo + ' atualizado(a) com sucesso!',
        'item': item,
      });
    }
  });
  
  const _atualizar = (req, res) => {
    if (req && req.params.id && res) {
      if (mapear) {
        mapear(req.body, _atualizarNoRepositorio(req, res));
      } else {
        _atualizarNoRepositorio(req, res);
      }
    }
  };
  
  const _remover = (req, res) => {
    if (req && req.params.id && res) {
      dao.remover(req.params.id, (erro) => {
        if (erro) {
          res.status(404).json({'erro': erro});
        } else {
          res.status(200).json({
            'mensagem': tipo + ' removido(a) com sucesso!',
          });
        }
      });
    }
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