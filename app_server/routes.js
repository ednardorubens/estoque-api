var express = require('express');
var ctrlMain = require('./controllers/main');
var ctrlUnidade = require('./controllers/unidade');
var ctrlProduto = require('./controllers/produto');

module.exports = router = express.Router();

// Homepage
router.get('/', ctrlMain.index);

// Unidades Controller
router.get('/unidades', ctrlUnidade.listar);
router.get('/unidades/inserir', ctrlUnidade.inserir);
router.get('/unidades/buscar/:id', ctrlUnidade.buscar);
router.get('/unidades/remover/:id', ctrlUnidade.remover);

// Produtos Controller
router.get('/produtos', ctrlProduto.listar);
router.get('/produtos/inserir', ctrlProduto.inserir);
router.get('/produtos/buscar/:id', ctrlProduto.buscar);
router.get('/produtos/remover/:id', ctrlProduto.remover);