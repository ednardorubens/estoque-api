const Dao = require('../models/dao');

module.exports = (() => (tipo, masc = true, mapear = (objeto, callback) => callback()) => {
  const _dao = Dao(tipo, masc);

  const _responderBusca = (res, erro, itens) => {
    if (erro) {
      res.status(404).json({'erro': erro});
    } else if (!itens) {
      res.status(200).json({'mensagem': 'Nenhum ' + tipo + ' foi encontrad' + (masc ? 'o' : 'a') + '!'});
    } else {
      res.status(200).json(itens);
    }
  }
  
  const _responderAtualizacao = (req, res, erro, item, operacao) => {
    if (erro) {
      res.status(operacao === 'remover' ? 404 : 400).json({'erro': erro});
    } else if (item) {
      if (operacao === 'salvar') {
        res.status(201).location(req.path + '/' + item._id).json({
          'mensagem': tipo + ' salv' + (masc ? 'o' : 'a') + ' com sucesso!',
          'item': item,
        });
      } else if (operacao === 'atualizar') {
        res.status(200).json({
          'mensagem': tipo + ' atualizad' + (masc ? 'o' : 'a') + ' com sucesso!',
          'item': Object.assign(item, req.body),
        });
      } else if (operacao === 'remover') {
        res.status(200).json({
          'mensagem': tipo + ' removid' + (masc ? 'o' : 'a') + ' com sucesso!',
        });
      }
    } else {
      res.status(operacao === 'remover' ? 404 : 500)
        .json({'erro': operacao === 'remover' ? tipo + ' não encontrad' + (masc ? 'o' : 'a') : 'Ocorreu um erro desconhecido'});
    }
  }

  const _listar = (res, mensagem) => _dao.listar((erro, itens) => _responderBusca(res, erro, itens));
  
  const _buscar = (req, res) => {
    if (req.params.id) {
      _dao.buscar(req.params.id, (erro, item) => _responderBusca(res, erro, item));
    }
  };

  const _inserir = (req, res) => {
    if (req && req.body && res) {
      mapear(req.body, () => _dao.inserir(req.body, (erro, item) => _responderAtualizacao(req, res, erro, item, 'salvar')));
    }
  }
  
  const _atualizar = (req, res) => {
    if (req && req.params.id && res) {
      mapear(req.body, () => _dao.atualizar(req.params.id, req.body, (erro, item) => _responderAtualizacao(req, res, erro, item, 'atualizar')));
    }
  };
  
  const _remover = (req, res) => {
    if (req && req.params.id && res) {
      _dao.remover(req.params.id, (erro, item) => _responderAtualizacao(req, res, erro, item, 'remover'));
    }
  }
  
  return {
    listar    : (req, res) => _listar(res),
    buscar    : (req, res) => _buscar(req, res),
    inserir   : (req, res) => _inserir(req, res),
    atualizar : (req, res) => _atualizar(req, res),
    remover   : (req, res) => _remover(req, res),
  }
})();