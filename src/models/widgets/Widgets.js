const fs = require('fs');

class Widgets {
  constructor() {


    //! WIDGETS 
    // Menu Principal
    this.menuPrincipal = [
      { button: { text: '🤖 Horários de Funcionamento', hide: true }, type: 'horarios' },
      { button: { text: '🛒 Fazer Pedido', hide: true }, type: 'pedido' },
      { button: { text: '👨‍🍳 Promoções', hide: true }, type: 'promo' },
      { button: { text: '📍 Endereço', hide: true }, type: 'location' },
      { button: { text: '📞 Consulta de Pedidos', hide: true }, type: 'consulta' },
    ];

    // Menu de Opções de Pagamento
    this.menuPagamento = [
      { button: { text: '💳 Cartão', hide: true }, type: 'pagamento' },
      { button: { text: '💵 Dinheiro', hide: true }, type: 'pagamento' },
      { button: { text: '📱 Pix', hide: true }, type: 'pagamento' }
    ];

    // Menu de Confirmação
    this.menuConfirmacao = [
      { button: { text: '✅ Sim', hide: true }, type: 'message' },
      { button: { text: '❌ Não', hide: true }, type: 'message' }
    ];

    // Exemplo de estrutura para outros menus
    this.menuExemplo = [
      { button: { text: '🌟 Opção 1', hide: true }, type: 'message' },
      { button: { text: '🔥 Opção 2', hide: true }, type: 'message' },
      { button: { text: '🎉 Opção 3', hide: true }, type: 'message' }
    ];

    // Menu de Reclamações
    this.menuReclamacoes = [
      { button: { text: '📢 Reportar um problema', hide: true }, type: 'reportIssue' },
      { button: { text: '❓ Pergunta', hide: true }, type: 'question' }
    ];

    // Menu Finalização
    this.menuFinalizacao = [
      { button: { text: '📦 Acompanhar Pedido', hide: true }, type: 'trackOrder' },
      { button: { text: '🔄 Refazer Pedido', hide: true }, type: 'redoOrder' }
    ];

  }

  // Método que pega a escolha do cliente dentro do menu
  getSelectedOption(menu, input) {
    const selectedOptionByNumber = menu[Number(input) - 1];
    if (selectedOptionByNumber) {
      return selectedOptionByNumber;
    }

    const selectedOptionByText = menu.find(item =>
      item.button.text.toLowerCase().includes(input.toLowerCase())
    );
    if (selectedOptionByText) {
      return selectedOptionByText;
    }

    return null;
  }

  enviarMenu(titulo, menu_object) {
    let menu_text = this.getMenuText(titulo, menu_object);
    return menu_text
  }

  // Método que pega a intenção do cliente dentro do menu
  getIntentFromOption(menu, input) {
    const selectedOptionByNumber = menu[Number(input) - 1];
    if (selectedOptionByNumber) {
      return selectedOptionByNumber.type; // 'type' agora representa 'intent'
    }

    const selectedOptionByText = menu.find(item =>
      item.button.text.toLowerCase().includes(input.toLowerCase())
    );
    if (selectedOptionByText) {
      return selectedOptionByText.type; // 'type' agora representa 'intent'
    }

    return null;
  }


  // Menus com textos descritivos
  getMenuTextWithDescriptions(title, menu) {
    let menuText = `🔸 ${title} 🔸\n\n`;
    menu.forEach((item, index) => {
      menuText += `${index + 1}. ${item.button.text}\n`;
      menuText += `   Descrição: ${item.description}\n`;
    });

    menuText += `\n📝 Digite o *Número* para escolher o item desejado.\n\n`;

    return menuText;
  }

  getMenuText(title, menu) {
    let menuText = `⚡️  *${title}* ⚡️ \n\n`;

    menu.forEach((item, index) => {
      menuText += `${index + 1}) ${item.button.text}\n`;
    });

    menuText += `\n📝 Digite o *Número* ou *Escreva a opção*  para escolher o item desejado.`;

    return menuText;
  }


  //Tentativa de menus formatados

  formatMenu(title, menu) {
    let formattedMenu = `🔸 ${title} 🔸\n\n`;
    menu.forEach((item, index) => {
      formattedMenu += `⚡️ ${index + 1}. ${item.button.text}\n`;
    });
    formattedMenu += '\n*OBS: Todas as formas de pagamento sao feitos no ato da entrega*';
    return formattedMenu;
  }

  formatMenuWithTable(title, menu) {
    let formattedMenu = `${title}:\n\n`;
    formattedMenu += '| Opção | Descrição | Preço |\n|---|---|---|\n';
    menu.forEach((item, index) => {
      formattedMenu += `| ${index + 1} | ${item.button.text} | ${item.description} | ${item.price} |\n`;
    });
    return formattedMenu;
  }

  formatMenuWithFormatting(title, menu) {
    let formattedMenu = `🔸 ${title} 🔸\n\n`;
    menu.forEach((item, index) => {
      formattedMenu += `⭐️ ${index + 1}. *${item.button.text}*\n`;
      formattedMenu += `   - Preço: ${item.price}\n`;
    });

    return formattedMenu;
  }
}

module.exports = Widgets;

function main_widgets() {
  const widgets = new Widgets();

  //! Menu principal
  const menuPrincipal = widgets.menuPrincipal;
  const menuPrincipalText = widgets.getMenuText('Menu Principal', menuPrincipal);
  console.log(menuPrincipalText);


  //! Menu de categorias
  const menuCategorias = widgets.menuCategorias;
  const categoriasText = widgets.getMenuText('Categorias de Lanches', menuCategorias);
  console.log(categoriasText);

  //! Exemplo de uso da função getSelectedOption
  const userInput = '2'; // Opção selecionada pelo usuário (número ou texto)

  const selectedOption = widgets.getSelectedOption(menuCategorias, userInput);
  if (selectedOption) {
    console.log('Opção selecionada:', selectedOption.button.text.slice(3));
    // Faça o que for necessário para a opção selecionada
  } else {
    console.log('Opção inválida');
    // Trate a opção inválida conforme necessário
  }
}

//main_widgets();