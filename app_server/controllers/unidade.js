module.exports = (() => {
  const Controller = require('./controller');
  const unidadeController = Controller('Unidade', (req) => {
    if (req.query.nome && req.query.sigla) {
      return {
        nome: req.query.nome,
        sigla: req.query.sigla,
      }
    }
  });

  return {
    listar:  (req, res) => unidadeController.listar(res),
    buscar:  (req, res) => unidadeController.buscar(req, res),
    inserir: (req, res) => unidadeController.inserir(req, res),
    remover: (req, res) => unidadeController.remover(req, res),
  }
})()