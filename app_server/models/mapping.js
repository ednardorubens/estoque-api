const mongoose = require('mongoose'), Schema = mongoose.Schema;

mongoose.model('Produto', new Schema({
  nome: {type: String, unique: true, required: true, maxlength: 300},
  unidade: {type: String, required: true, maxlength: 50},
  quantidade: {type: Number, default: 1, max: 1000000},
  valor_de_compra: {type: Number, max: 10000, required: true},
  criado_em: {type: Date, default: Date.now},
  atualizado_em: {type: Date, required: true},
}, {
  versionKey: false
}));