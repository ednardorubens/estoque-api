var locations = require('../models/locations')

module.exports = (() => {

  let state = {
    id: -1,
    unidades: [],
  }

  const _jsonResponse = (res, content) => {
    res.status(200);
    res.json(content);
  };

  const _buscarUnidade = (id) => {
    return state.unidades.filter(unidade => unidade.id == id)[0];
  };

  return {
    listar: (req, res) => {
      locations.criarUnidade();
      _jsonResponse(res, state.unidades);
    },
    
    buscar: (req, res) => {
      _jsonResponse(res, _buscarUnidade(req.params.id));
    },

    inserir: (req, res) => {
      state.unidades.push({
        id: ++state.id,
        nome: 'Unidade ' + state.id,
      });
      _jsonResponse(res, state.unidades);
    },

    remover: (req, res) => {
      state.unidades = state.unidades.filter(unidade => unidade.id != req.params.id);
      res.send('Unidade removido com sucesso!');
    },
  };

})();