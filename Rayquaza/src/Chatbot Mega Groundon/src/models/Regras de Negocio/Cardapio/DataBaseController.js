const fs = require('fs');
const Produto = require('./Lanches/Produto');




class DataBaseController {
  constructor() {
    this.sanduicheTradicionalFile = '/home/pedrov/Documentos/GitHub/Chatbot-Whatsapp/Chatbot - Delivary e Entregas/Chatbot Rayquaza x Groundon x Kyogre/Rayquaza/src/Chatbot Mega Groundon/repository/cardapio_1.json';
    this.acaiFile = '/home/pedrov/Documentos/GitHub/Chatbot-Whatsapp/Chatbot - Delivary e Entregas/Chatbot Rayquaza x Groundon x Kyogre/Rayquaza/src/Chatbot Mega Groundon/repository/cardapio_2.json';
    this.petiscosFile = '/home/pedrov/Documentos/GitHub/Chatbot-Whatsapp/Chatbot - Delivary e Entregas/Chatbot Rayquaza x Groundon x Kyogre/Rayquaza/src/Chatbot Mega Groundon/repository/cardapio_3.json'
  }

  //!Comidas
  async get_SanduichesTradicionais(productFile, tipo_produto, callback) {
    try {
      //Busca o arquivo JSON e converte para objeto
      const data = fs.readFileSync(productFile, 'utf8');
      const listaProdutos = JSON.parse(data);


      //Cria um array de produtos
      const produtos = listaProdutos.map((produtoJson) => {

        //Desestrutura o objeto e cria um novo produto
        const { [tipo_produto]: nome, 'Igredientes': ingredientes, 'Preço.4': preco } = produtoJson;

        //Cria um novo produto
        const produto = new Produto(nome, tipo_produto, ingredientes);
        produto.preco = preco;
        return produto;
      });

      callback(produtos);
    } catch (error) {
      console.error('Erro ao ler o arquivo JSON:', error);
      return null;
    }
  }

  async get_acai(productFile, tipo_produto, callback) {
    try {
      // Busca o arquivo JSON e converte para objeto
      const data = fs.readFileSync(productFile, 'utf8');
      const listaProdutos = JSON.parse(data);

      const produtos = listaProdutos.map((produtoJson) => {
        // Desestrutura o objeto e cria um novo produto
        const { [tipo_produto]: nome, '300ml': preco300ml, '500ml': preco500ml } = produtoJson;

        // Cria um novo produto
        const produto = new Produto(nome, tipo_produto);

        // Verifica se há tamanho e adiciona ao produto
        if (preco300ml) {
          produto.adicionarTamanho('300ml', preco300ml);
        }
        if (preco500ml) {
          produto.adicionarTamanho('500ml', preco500ml);
        }

        return produto;

      });

      callback(produtos);
    } catch (error) {
      console.error('\n\nErro ao ler o arquivo JSON:', error);
      return null;
    }
  }


  async get_petisco(productFile, tipo_produto, callback) {
    try {
      // Busca o arquivo JSON e converte para objeto
      const data = fs.readFileSync(productFile, 'utf8');
      const listaProdutos = JSON.parse(data);

      const produtos = listaProdutos.map((produtoJson) => {
        // Desestrutura o objeto e cria um novo produto
        const { [tipo_produto]: nome, 'Meia': preco_meia, 'Inteira': preco_inteira } = produtoJson;

        // Cria um novo produto
        const produto = new Produto(nome, tipo_produto);

        // Verifica se há tamanho e adiciona ao produto
        if (preco_meia) {
          produto.adicionarTamanho('Meia', preco_meia);
        }
        if (preco_inteira) {
          produto.adicionarTamanho('Inteira', preco_inteira);
        }

        return produto;
      });

      callback(produtos);
    } catch (error) {
      console.error('Erro ao ler o arquivo JSON:', error);
      return null;
    }
  }


  //!Bebidas

  //!Sobremesas

  //!Pizzas

  //!Hambugueres


}

module.exports = DataBaseController;


function main_db_controller() {
  const db = new DataBaseController();

  db.get_SanduichesTradicionais(db.sanduicheTradicionalFile, 'Sanduíches Tradicionais', (produtos) => {
    console.log(produtos);
  });

  db.get_acai(db.acaiFile, 'Açaí e Pitaya', (produtos) => {
    console.log(produtos);
  });

  db.get_petisco(db.petiscosFile, 'Petiscos', (produtos) => {
    console.log(produtos);
  });
}

//main_db_controller();