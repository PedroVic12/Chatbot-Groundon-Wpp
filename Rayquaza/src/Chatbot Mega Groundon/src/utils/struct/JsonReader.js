const fs = require('fs');

class Produto {
  constructor(nome, ingredientes, tipo_produto) {
    this.nome = nome;
    this.ingredientes = ingredientes;
    this.tipo_produto = tipo_produto;
    this.tamanhos = {};
    this.preco = 0;
  }

  adicionarTamanho(tamanho, valor) {
    this.tamanhos[tamanho] = valor;
  }

  toString() {
    let produtoInfo = `Tipo de Produto: ${this.tipo_produto}\nNome: ${this.nome}\nIngredientes: ${this.ingredientes}\n`;

    for (const tamanho in this.tamanhos) {
      const valor = this.tamanhos[tamanho];
      produtoInfo += `${tamanho}: ${valor}\n`;
    }

    return produtoInfo;
  }
}

function lerJson(jsonFile, tipo_produto) {
  try {
    const data = fs.readFileSync(jsonFile, 'utf8');
    const listaProdutos = JSON.parse(data);

    const produtos = listaProdutos.map((produtoJson) => {
      const { [tipo_produto]: nome, 'Igredientes': ingredientes, 'Preço.4': preco } = produtoJson;
      const produto = new Produto(nome, ingredientes, tipo_produto);
      produto.preco = preco;
      return produto;
    });

    return produtos;
  } catch (error) {
    console.error('Erro ao ler o arquivo JSON:', error);
    return null;
  }
}

const jsonFile = '/workspaces/Chatbot-Whatsapp/Chatbot - Delivary e Entregas/Chatbot Rayquaza x Groundon x Kyogre/Rayquaza/src/Chatbot Mega Groundon/repository/cardapio_1.json';
const tipo_produto = 'Sanduíches Tradicionais';
const produtos = lerJson(jsonFile, tipo_produto);
console.log(produtos);
