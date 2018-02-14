const mongoose = require('mongoose'), Schema = mongoose.Schema;
const Data = require('../helpers/data');

const produtoSchema = new Schema({
  nome: {type: String, unique: true, required: true, trim: true, maxlength: 300},
  unidade: {type: String, required: true, trim: true, maxlength: 50},
  quantidade: {type: Number, default: 1, max: 1000000},
  valor_de_compra: {type: Number, max: 10000, required: true},
  criado_em: {type: Date, default: Date.now},
  atualizado_em: {type: Date, required: true},
}, {
  versionKey: false,
});

const _formatarValor = (valor, casas = 2) => ('R$ ' +  valor.toFixed(casas));

const _getValorFracionado = (produto) => (produto.valor_de_compra / produto.quantidade);

produtoSchema.method({
  valor_fracionado: function() {
    return _formatarValor(_getValorFracionado(this), 4);
  },
  toJSON: function() {
    return {
      _id: this._id,
      nome: this.nome,
      unidade: this.unidade,
      quantidade: this.quantidade,
      valor_de_compra: _formatarValor(this.valor_de_compra, 2),
      criado_em: this.criado_em,
      atualizado_em: this.atualizado_em,
      valor_fracionado: _formatarValor(_getValorFracionado(this), 4)
    }
  }
});

mongoose.model('Produto', produtoSchema);

const fichaSchema = new Schema({
  nome: {type: String, unique: true, trim: true, required: true, maxlength: 300},
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
});
  
_getProdutos = (ficha) => ficha.produtos.map((aux) => {
  const custo = aux.quantidade * _getValorFracionado(aux.produto);
  return {
    nome: aux.produto.nome,
    unidade: aux.produto.unidade,
    quantidade: aux.quantidade,
    custo: _formatarValor(custo)
  };
});

fichaSchema.method({
  getProdutos: function() {
    return _getProdutos(this);
  },
  toJSON: function() {
    const custo_total = this.produtos.reduce((total, aux) => {
      return total += aux.quantidade * _getValorFracionado(aux.produto);
    }, 0);
    const perc_perda = custo_total + (custo_total * this.perc_perda / 100);
    const custo_rendimento = (perc_perda / this.rendimento)
    return {
      _id: this._id,
      nome: this.nome,
      produtos: _getProdutos(this),
      custo_total: _formatarValor(custo_total),
      perc_perda: _formatarValor(perc_perda) + ' (' + this.perc_perda + '%)',
      rendimento: this.rendimento,
      custo_rendimento: _formatarValor(custo_rendimento)
    }
  }
});

mongoose.model('Ficha', fichaSchema);

const usuarioSchema = new mongoose.Schema({
  email: {type: String, unique: true, trim: true, required: true },
  nome: {type: String, required: true, trim: true},
  senha: {type: String, required: true}
}, {
  versionKey: false
});

usuarioSchema.method({
  gerarJwt: function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    const jwt = require('jsonwebtoken');
    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
  }
});

const bcrypt = require('bcrypt');
usuarioSchema.pre('save', function(next) {
  const usuario = this;
  bcrypt.hash(usuario.senha, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    usuario.senha = hash;
    next();
  });
});

const msgErro = (mensagem, status) => {
  return {
    mensagem: mensagem,
    status: status
  }
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

usuarioSchema.static({
  autenticar: (email, senha, callback) =>
    Usuario.findOne({email: email}).exec((erro, usuario) => {
      if (erro) {
        return callback(msgErro(erro, 404));
      } else if (!usuario) {
        return callback(msgErro('Usuário não encontrado.', 401));
      }
      bcrypt.compare(senha, usuario.senha, (erroSenha, encontrado) => {
        if (encontrado === true) {
          return callback(null, usuario);
        } else {
          return callback(msgErro('Usuário ou senha inválida.', 401));
        }
      })
    })
});
