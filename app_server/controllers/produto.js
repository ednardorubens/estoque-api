const Controller = require('./controller');

module.exports = (() => {
  const controller = Controller('Produto', (req) => {
    if (req.query.nome && req.query.sigla) {
      return {
        nome: req.query.nome,
        sigla: req.query.sigla,
      }
    }
  });

  return {
    listar : (req, res) => controller.listar(res),
    buscar : (req, res) => controller.buscar(req, res),
    inserir: (req, res) => controller.inserir(req, res),
    remover: (req, res) => controller.remover(req, res),
  }
})()