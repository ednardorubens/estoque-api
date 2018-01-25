var express = require('express');
var ctrlMain = require('./controllers/main');
var ctrlProduto = require('./controllers/produto');
module.exports = router = express.Router();

// Homepage
router.get('/', ctrlMain.index);

// Produtos Controller
router.get('/produtos', ctrlProduto.listar);
router.get('/produtos/:id', ctrlProduto.buscar);
router.get('/produtos/:id/remover', ctrlProduto.remover);
router.get('/produtos/inserir', ctrlProduto.inserir);