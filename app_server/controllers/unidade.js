const Controller = require('./controller');

module.exports  = (router) => {
  const controller = Controller('Unidade', false);
  
  router.get('/unidades', controller.listar);
  router.post('/unidades', controller.inserir);
  router.get('/unidades/:id', controller.buscar);
  router.put('/unidades/:id', controller.atualizar);
  router.delete('/unidades/:id', controller.remover);
};