const _jsonResponse = (res, content) => {
  res.status(200);
  res.json(content);
}

const _buscarProduto = (id) => {
  return produtos.filter(produto => produto.id == id)[0];
}

let produtos = [
  {
    id: 1,
    nome: 'Produto 1',
  },
  {
    id: 2,
    nome: 'Produto 2',
  },
]

module.exports = {

  listar(req, res) {
    _jsonResponse(res, produtos);
  },
  
  buscar(req, res) {
    _jsonResponse(res, _buscarProduto(req.params.id));
  },
  
  inserir(req, res) {
    let qtd = produtos.length + 1;
    
    produtos.push({
      id: qtd,
      nome: 'Produto ' + qtd,
    });
    _jsonResponse(res, produtos);
  },
  
  remover(req, res) {
    produtos = produtos.filter(produto => produto.id != req.params.id);
    res.send('Produto Removido!');
  },
}