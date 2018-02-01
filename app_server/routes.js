module.exports = router = require('express').Router();

router.get('/', require('./controllers/main').index);
var ctrlUnidade = require('./controllers/unidade')(router);
var ctrlProduto = require('./controllers/produto')(router);