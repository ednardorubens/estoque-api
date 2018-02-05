const Controller = require('./controller');

module.exports  = (router) => {
  const mapear = (ficha, callback) => {
    if (ficha) {
      if (ficha.atualizado_em) {
        let data = '' + ficha.atualizado_em;
        data = data.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
        ficha.atualizado_em = new Date(data);
      }
      callback();
    }
  };

  const controller = Controller('Ficha', false, mapear);

  const _listar = (req, res) => controller.getDao().listar((erro, itens) => {
    if (itens) {
      itens = itens.map(ficha => {
        let custo_total = 0;
        const produtos = ficha.produtos.map((aux) => {
          const custo = aux.quantidade * (aux.produto.valor_de_compra / aux.produto.quantidade);
          custo_total += custo;
          return {
            nome: aux.produto.nome,
            unidade: aux.produto.unidade,
            quantidade: aux.quantidade,
            custo: 'R$ ' + custo.toFixed(2)
          };
        });
        const perc_perda = custo_total + (custo_total * ficha.perc_perda / 100);
        const custo_rendimento = (perc_perda / ficha.rendimento)
        return {
          _id: ficha._id,
          nome: ficha.nome,
          produtos: produtos,
          custo_total: 'R$ ' + custo_total.toFixed(2),
          perc_perda: 'R$ ' + perc_perda.toFixed(2) + ' (' + ficha.perc_perda + '%)',
          rendimento: ficha.rendimento,
          custo_rendimento: 'R$ ' + custo_rendimento.toFixed(2)
        }
      });
    }
    controller.responderBusca(res, erro, itens);
  }).populate('produtos.produto');

  router.get('/fichas', _listar);
  router.post('/fichas', controller.inserir);
  router.get('/fichas/:id', controller.buscar);
  router.put('/fichas/:id', controller.atualizar);
  router.delete('/fichas/:id', controller.remover);
};