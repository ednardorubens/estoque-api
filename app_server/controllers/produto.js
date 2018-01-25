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
    nome: 'produto1',
  },
  {
    id: 2,
    nome: 'produto2',
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
    produtos.push({
      id: 3,
      nome: 'produto3',
    });
  },

  remover(req, res) {
    let produto = _buscarProduto(req.params.id);
    res.send('Removendo ' + produto.nome);
  },
}