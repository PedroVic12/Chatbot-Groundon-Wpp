// Importando as classes necessárias
const CardapioMenu = require('../../models/Regras de Negocio/Cardapio/Menu_Cardapio');
const DataBaseController = require('../../models/Regras de Negocio/Cardapio/DataBaseController');
const Pedido = require('../../models/Regras de Negocio/Pedido/Pedido');
const Carrinho = require('../../models/Regras de Negocio/Pedido/Carrinho');

// Função para realizar um pedido
async function realizarPedido() {
    const pedido = new Pedido();
    const cardapio = new CardapioMenu();
    const dataController = new DataBaseController();
    const carrinho = new Carrinho();

    // Escolhendo o tipo de produto e buscando o cardápio
    const ESCOLHA_CLIENTE = '1'; // Exemplo: usuário escolheu a opção 1 do menu
    const { tipo_produto, arquivo_produto } = cardapio.getTipoEArquivoProduto(ESCOLHA_CLIENTE);
    const produtosCardapio = await cardapio.criarArvore(tipo_produto, arquivo_produto);

    // Exemplo: usuário escolheu o primeiro produto do cardápio
    const produtoEscolhido = produtosCardapio[0];

    // Adicionando o produto ao pedido
    pedido.adicionarProduto(produtoEscolhido);

    // Exibindo o produto adicionado ao pedido
    console.log('Produto adicionado ao pedido:');
    console.log(produtoEscolhido);

    // Adicionando o produto ao carrinho
    carrinho.adicionarProduto(produtoEscolhido);

    // Calculando o total do carrinho
    const totalCarrinho = carrinho.calcularTotal();
    console.log('Total do carrinho:', totalCarrinho);
}

// Executando o exemplo
realizarPedido();
