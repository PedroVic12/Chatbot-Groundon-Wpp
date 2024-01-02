class Produto {
    constructor(nome, tipo_produto, ingredientes) {
      this.nome = nome;
      this.tipo_produto = tipo_produto;
      this.ingredientes = ingredientes;
      this.tamanhos = {};
      this.preco = 0;
    }
  
    adicionarTamanho(tamanho, valor) {
      this.tamanhos[tamanho] = valor;
    }
  
    formatado() {
      let produtoInfo = `Tipo de Produto: ${this.tipo_produto}\nNome: ${this.nome}\nIngredientes: ${this.ingredientes}\n`;

      for (const tamanho in this.tamanhos) {
        const valor = this.tamanhos[tamanho];
        produtoInfo += `${tamanho}: ${valor}\n`;
      }
  
      return produtoInfo;
    }
  }

module.exports = Produto;