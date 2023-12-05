const CardapioMenu = require('../../models/Regras de Negocio/Cardapio/Menu_Cardapio');
const DataBaseController = require('../../models/Regras de Negocio/Cardapio/DataBaseController');



function main_struct() {
  
    const cardapio = new CardapioMenu(); 
    const dataController = new DataBaseController();
    
    // Cria a árvore de produtos
    cardapio.criarArvore('Sanduíches Tradicionais', dataController.sanduicheTradicionalFile)
    .then((sanduiche_menu) => {
      let cardapio_text = `🍔 *Cardápio de Sanduíches Tradicionais* 🍔\n\n`;
      sanduiche_menu.forEach((produto, index) => {
        cardapio_text += cardapio.mostrarProdutoCardapio(produto, index);
      });
      cardapio_text += `📝 Para escolher seu item, envie o número ou o nome\n`;
      cardapio_text += '🚫 Para cancelar, envie *cancelar*.\n';
      console.log('\nDebug:', cardapio_text);
    })
    .catch((error) => {
      console.log(error);
    });


    
    let arvore_acai = cardapio.criarArvore('Açaí e Pitaya', dataController.acaiFile);
    console.log(arvore_acai)
    cardapio.criarArvore('Petiscos', dataController.petiscosFile);
    
    // Buscar um produto pelo tipo e nome
    function encontrarProduto(){
      const produtoEncontrado = cardapio.buscarPorNome('Sanduíches Tradicionais', 'Americano');
      if (produtoEncontrado) {
       console.log('\n\nProduto encontrado!\n\n', produtoEncontrado);
      } else {
       console.log('Produto não encontrado');
      }
    }

    
    
}
//main_struct();