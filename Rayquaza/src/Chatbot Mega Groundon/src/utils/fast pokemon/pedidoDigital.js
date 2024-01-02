function getPedidoCardapio(pedidoString) {
    // Encontrar o nome do cliente usando regex
    const nomeClienteMatch = pedidoString.match(/Cliente: ([\w\s]+?)\n/);
    const nomeCliente = nomeClienteMatch ? nomeClienteMatch[1].trim() : null;

    // Encontrar o número do pedido usando regex
    const numeroPedidoMatch = pedidoString.match(/Pedido #(\d+)/);
    const numeroPedido = numeroPedidoMatch ? parseInt(numeroPedidoMatch[1], 10) : null;

    // Encontrar os itens do pedido usando regex
    const itemPattern = /(\d+)x ([^\(]+) \(R\$ ([\d\.]+)\)/g;
    const itensList = [];
    let itemMatch;
    while (itemMatch = itemPattern.exec(pedidoString)) {
        itensList.push({
            quantidade: parseInt(itemMatch[1], 10),
            nome: itemMatch[2].trim(),
            preco: parseFloat(itemMatch[3])
        });
    }

    // Encontrar o total usando regex
    const totalMatch = pedidoString.match(/TOTAL: R\$([\d\.]+)/);
    const total = totalMatch ? parseFloat(totalMatch[1]) : null;

    return {
        nome: nomeCliente,
        pedido: numeroPedido,
        itens: itensList,
        total: total
    };
}

// Testando a função
const pedidoString = `
� RESUMO DO PEDIDO 
   Cliente: anakin skywalker

 Pedido #5395

  � Itens do Pedido:
   
1x Açai Tradicional (R$ 14)

2x Bauru (R$ 30)
   -------------------------------------
           � TOTAL: R$74.00
   -------------------------------------
   � Tempo de Entrega: aprox. 09:20 a 09:55
`;

console.log(getPedidoCardapio(pedidoString));
