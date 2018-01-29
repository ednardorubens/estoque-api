const mongoose = require('mongoose');

module.exports = (() => {
  
  const regCall = (tipo, error) => console.log(
    error ? ('Ocorreu um erro ao criar um(a) ' + tipo + ': ' + error) : (tipo + ' criado(a) com sucesso')
  );
  
  const UnidadeSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sigla: {type: String, required: true},
  });

  const ProdutoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    unidade: {type: UnidadeSchema, required: true},
    quantidade: {type: Number, default: 1, min: 1, max: 250},
    valor_compra: {type: Number, required: true, max: 1000},
    criado_em: {type: Date, default: Date.now},
    atualizado_em: {type: Date, required: true},
  });
  
  return {
    criarUnidade: () => {
      
      const Unidade = mongoose.model('Unidade', UnidadeSchema);
      
      const unidade = new Unidade({
        nome: 'Grama',
        sigla: 'g'
      });
      
      unidade.save((error) => regCall('Unidade', error));
      console.log('Passei aqui');
    }
  }
})();