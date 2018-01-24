var express = require('express');
var ctrlMain = require('../controllers/main');
var ctrlProduto = require('../controllers/produto');
var router = express.Router();

router.get('/', ctrlMain.index);

// Produtos Controller
router.get('/produtos', ctrlProduto.listar);
router.get('/produtos/:id', ctrlProduto.buscar);
router.delete('/produtos/:id', ctrlProduto.remover);

module.exports = router;