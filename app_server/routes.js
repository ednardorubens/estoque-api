var express = require('express');
var ctrlMain = require('./controllers/main');
var ctrlUnidade = require('./controllers/unidade');
var ctrlProduto = require('./controllers/produto');

module.exports = router = express.Router();

// Homepage
router.get('/', ctrlMain.index);

// Unidades Controller
router.get('/unidades', ctrlUnidade.listar);
router.post('/unidades', ctrlUnidade.inserir);
router.get('/unidades/:id', ctrlUnidade.buscar);
router.put('/unidades/:id', ctrlUnidade.atualizar);
router.delete('/unidades/:id', ctrlUnidade.remover);

// Produtos Controller
router.get('/produtos', ctrlProduto.listar);
router.post('/produtos', ctrlProduto.inserir);
router.get('/produtos/:id', ctrlProduto.buscar);
router.put('/produtos/:id', ctrlProduto.atualizar);
router.delete('/produtos/:id', ctrlProduto.remover);