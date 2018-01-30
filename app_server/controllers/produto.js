module.exports = (() => {
  const Controller = require('./controller');
  const produtoController = Controller('Produto', (req) => {
    if (req.query.nome &&
        req.query.sigla &&
        req.query.quantidade &&
        req.query.valor_compra &&
        req.query.atualizado_em
      ) {
      const Unidade = require('mongoose').model('Unidade');

      return {
        nome: req.query.nome,
        unidade: Unidade.findOne({'sigla' : req.query.sigla}),
        quantidade: req.query.quantidade,
        valor_compra: req.query.valor_compra,
        atualizado_em: req.query.atualizado_em,
      }
    }
  });

  return {
    listar : (req, res) => produtoController.listar(res),
    buscar : (req, res) => produtoController.buscar(req, res),
    inserir: (req, res) => produtoController.inserir(req, res),
    remover: (req, res) => produtoController.remover(req, res),
  }
})()