const fs = require('fs');


class LancheModel {
  constructor(description, price) {
    this.description = description;
    this.price = price;
  }
}

class Sanduiche extends LancheModel {
  constructor(description, price, ingredientes) {
    super(description, price);
    this.ingredientes = ingredientes;
  }
}


class Comida {
  constructor(nome, price, ingredients, tipo) {
    this.nome = nome;
    this.price = price;
    this.ingredients = ingredients;
    this.tipo = tipo; // Adicionando a propriedade tipo
  }
}


module.exports = Comida;
module.exports = Sanduiche;
module.exports = LancheModel;