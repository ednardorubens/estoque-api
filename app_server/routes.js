module.exports = router = require('express').Router();

router.get('/', require('./controllers/main').index);
var ctrlProduto = require('./controllers/produto')(router);
var ctrlFicha = require('./controllers/ficha')(router);