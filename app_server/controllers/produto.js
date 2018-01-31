const Controller = require('./controller');

module.exports = Controller('Produto', (produto, callback) => {
  if (produto) {
    if (produto.atualizado_em) {
      let data = produto.atualizado_em;
      data = data.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
      produto.atualizado_em = new Date(data);
    }
    const Unidade = require('mongoose').model('Unidade');
    Unidade.findOne({'sigla' : produto.unidade}, (erro, unidade) => {
      produto.unidade = unidade._id;
      callback();
    });
  }
});