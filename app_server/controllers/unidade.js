const Controller = require('./controller');

module.exports = Controller('Unidade', (req) => {
  const unidade = {};
  if (req.body.nome) {
    unidade.nome = req.body.nome;
  }
  if (req.body.sigla) {
    unidade.sigla = req.body.sigla;
  }
  return unidade;
});