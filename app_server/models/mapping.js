const mongoose = require('mongoose'), Schema = mongoose.Schema;

mongoose.model('Produto', new Schema({
  nome: {type: String, unique: true, required: true, maxlength: 300},
  unidade: {type: String, required: true, maxlength: 50},
  quantidade: {type: Number, default: 1, max: 1000000},
  valor_de_compra: {type: Number, max: 10000, required: true},
  criado_em: {type: Date, default: Date.now},
  atualizado_em: {type: Date, required: true},
}, {
  versionKey: false,
}));

mongoose.model('Ficha', new Schema({
  nome: {type: String, unique: true, required: true, maxlength: 300},
  produtos: {
    type: [new Schema({
      produto: {type: Schema.Types.ObjectId, ref: 'Produto', required: true},
      quantidade: {type: Number, default: 1, max: 1000000},
    }, {
      id: false,
      _id: false,
      versionKey: false
    })],
    required: true,
    validate : [produtos => (produtos && produtos.length > 0),
      'Pelo menos um produto deve ser inserido na ficha']
  },
  perc_perda: {type: Number, min: -100, max: 100, required: true},
  rendimento: {type: Number, max: 100000000, required: true},
  criado_em: {type: Date, default: Date.now},
  atualizado_em: {type: Date, required: true},
}, {
  versionKey: false
}));