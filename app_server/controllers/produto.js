module.exports = (() => {

  let state = {
    id: -1,
    produtos: [],
  }

  const _jsonResponse = (res, content) => {
    res.status(200);
    res.json(content);
  };

  const _buscarProduto = (id) => {
    return state.produtos.filter(produto => produto.id == id)[0];
  };

  return {
    listar: (req, res) => {
      _jsonResponse(res, state.produtos);
    },
    
    buscar: (req, res) => {
      _jsonResponse(res, _buscarProduto(req.params.id));
    },

    inserir: (req, res) => {
      state.produtos.push({
        id: ++state.id,
        nome: 'Produto ' + state.id,
      });
      _jsonResponse(res, state.produtos);
    },

    remover: (req, res) => {
      state.produtos = state.produtos.filter(produto => produto.id != req.params.id);
      res.send('Produto removido com sucesso!');
    },
  };

})();