const mongoose = require('mongoose'), Schema = mongoose.Schema;

mongoose.model('Unidade', new Schema({
  nome: {type: String, unique: true, required: true},
  sigla: {type: String, unique: true, required: true},
}, {
  versionKey: false
}));

mongoose.model('Produto', new Schema({
  nome: {type: String, unique: true, required: true},
  unidade: {type: Schema.Types.ObjectId, ref: 'Unidade', required: true},
  quantidade: {type: Number, default: 1, min: 1, max: 250},
  valor_compra: {type: Number, required: true, max: 1000},
  criado_em: {type: Date, default: Date.now},
  atualizado_em: {type: Date, required: true},
}, {
  versionKey: false
}));