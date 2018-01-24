const jsonResponse = (res, content) => {
  res.status(200);
  res.json(content);
}

module.exports = (produto) = {

  listar: (req, res) => {
    jsonResponse(res, {'produtos': [
      {
        'id': '1',
        'nome': 'produto1',
      },
      {
        'id': '2',
        'nome': 'produto2',
      },
    ]});
  },

  buscar: (req, res) => {
    res.send('Busca de produtos');
  },

  remover: (req, res) => {
    res.send('Remoção de produtos');
  },
}