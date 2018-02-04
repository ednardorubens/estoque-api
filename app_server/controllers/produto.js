const Controller = require('./controller');

module.exports  = (router) => {
  const mapear = (produto, callback) => {
    if (produto) {
      if (produto.atualizado_em) {
        let data = '' + produto.atualizado_em;
        data = data.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
        produto.atualizado_em = new Date(data);
      }
      callback();
    }
  };

  const controller = Controller('Produto', mapear);

  const _listar = (req, res) => controller.getDao().listar((erro, itens) =>
    controller.responderBusca(res, erro, itens.map(produto => {
      return { ...produto._doc, valor_fracionado: produto.valor_de_compra / produto.quantidade };
    }))
  );

  router.get('/produtos', _listar);
  router.post('/produtos', controller.inserir);
  router.get('/produtos/:id', controller.buscar);
  router.put('/produtos/:id', controller.atualizar);
  router.delete('/produtos/:id', controller.remover);
};