const Controller = require('./controller');

module.exports = Controller('Produto', (req) => {
  const produto = {};
  if (req.body.nome) {
    produto.nome = req.body.nome;
  }
  if (req.body.unidade) {
    produto.unidade = req.body.unidade; 
  }
  if (req.body.quantidade) {
    produto.quantidade = req.body.quantidade;
  }
  if (req.body.valor_compra) {
    produto.valor_compra = req.body.valor_compra;
  }
  if (req.body.atualizado_em) {
    let data = req.body.atualizado_em;
    data = data.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
    produto.atualizado_em = new Date(data);
  }
  return produto;
}, (req, callback) => {
  const Unidade = require('mongoose').model('Unidade');
  Unidade.findOne({'sigla' : req.body.unidade}, (erro, unidade) => {
    req.body.unidade = unidade._id;
    callback();
  });
});