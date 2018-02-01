const mongoose = require('mongoose'), Schema = mongoose.Schema;

mongoose.model('Unidade', new Schema({
  nome: {type: String, unique: true, required: true, maxlength: 200},
  sigla: {type: String, unique: true, required: true, maxlength: 10},
}, {
  versionKey: false
}));

mongoose.model('Produto', new Schema({
  nome: {type: String, unique: true, required: true, maxlength: 300},
  unidade: {type: Schema.Types.ObjectId, ref: 'Unidade', required: true},
  quantidade: {type: Number, default: 1, min: 1, max: 1000000},
  valor_compra: {type: Number, max: 10000, required: true},
  criado_em: {type: Date, default: Date.now},
  atualizado_em: {type: Date, required: true},
}, {
  versionKey: false
}));