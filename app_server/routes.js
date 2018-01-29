var express = require('express');
var ctrlMain = require('./controllers/main');
var ctrlUnidade = require('./controllers/unidade');
var ctrlProduto = require('./controllers/produto');

module.exports = router = express.Router();

// Homepage
router.get('/', ctrlMain.index);

// Unidades Controller
router.get('/unidades', ctrlUnidade.listar);
router.get('/unidades/:id(\\d+)', ctrlUnidade.buscar);
router.get('/unidades/:id(\\d+)/remover', ctrlUnidade.remover);
router.get('/unidades/inserir', ctrlUnidade.inserir);

// Produtos Controller
router.get('/produtos', ctrlProduto.listar);
router.get('/produtos/:id(\\d+)', ctrlProduto.buscar);
router.get('/produtos/:id(\\d+)/remover', ctrlProduto.remover);
router.get('/produtos/inserir', ctrlProduto.inserir);