const fs = require('fs');

class Cliente {
    constructor() {
        this.id = ''
        this.nome = "";
        this.telefone = "";
        this.endereco_cliente = {
            endereco: "",
            complemento: ""
        };
        this.forma_pagamento = ''
        this.pedido = {}
        this.status_pedido = ''
        this.total_pagar = 0
        this.data_pedido = {
            data: '',
            hora: ''
        }
    }

    // Getter e Setter para o ID
    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    // Getter e Setter para Nome
    getNome() {
        return this.nome;
    }
    setNome(nome) {
        this.nome = nome;
    }


    setDataAtual() {
        let date = new Date().toLocaleString()
        const data_separada = date.split(',')


        const dataAtual = data_separada[0]
        this.data_pedido.data = dataAtual

        const hora = data_separada[1]
        this.data_pedido.hora = hora
    }

    getDataAtual() {
        return this.data_pedido
    }

    // Getter e Setter para Telefone
    getTelefone() {
        return this.telefone;
    }
    setTelefone(telefone) {
        this.telefone = telefone;
    }

    // Getter e Setter para Endereço
    getEndereco() {
        return this.endereco_cliente.endereco;
    }
    setEndereco(endereco) {
        this.endereco_cliente.endereco = endereco;
    }

    // Getter e Setter para Complemento
    getComplemento() {
        return this.endereco_cliente.complemento;
    }
    setComplemento(complemento) {
        this.endereco_cliente.complemento = complemento;
    }

    // Getter e Setter para Forma de Pagamento
    getFormaPagamento() {
        return this.forma_pagamento;
    }

    setFormaPagamento(forma_pagamento) {
        this.forma_pagamento = forma_pagamento;
    }


    setPedido(itensPedido) {
        // Adicione os itens do pedido ao objeto pedido
        this.pedido.itens = itensPedido.itens.map(item => {
            return {
                quantidade: item.quantidade,
                nome: item.nome,
                preco: item.preco
            };
        });

        // Calcule o total do pedido
        this.total_pagar = itensPedido.itens.reduce((total, item) => total + (item.quantidade * item.preco), 0);
    }

    getPedido() {
        return this.pedido
    }

    // Método para retornar os dados completos do cliente
    getDadosCompletos(pedido_object) {
        return {
            id_pedido: this.id,
            data: this.data_pedido,
            nome: this.nome,
            telefone: this.telefone,
            endereco: this.endereco_cliente.endereco,
            complemento: this.endereco_cliente.complemento,
            formaPagamento: this.forma_pagamento,
            pedido: pedido_object.itens,
            totalPagar: this.total_pagar,
        };
    }


    gerarPedidoJson(_clientData) {
        // Create a JSON representation of client data
        const clientDataJSON = JSON.stringify(_clientData, null, 4);

        // Write the JSON data to a file
        const fileName = `repository/pedidos/pedido_${this.getId()}.json`;
        fs.writeFileSync(fileName, clientDataJSON, 'utf-8');

        console.log(`JSON file generated: ${fileName}`);

        return clientDataJSON
    }
}




module.exports = Cliente;


function main_cliente() {
    // Create a new Cliente object
    const cliente = new Cliente();

    // Set client attributes
    cliente.setId(1213);
    cliente.setNome('John Doe');
    cliente.setTelefone('123-456-7890');
    cliente.setEndereco('123 Main Street');
    cliente.setComplemento('Apt 4B');
    cliente.setFormaPagamento('Credit Card');

    // Set client's order details
    cliente.setPedido({
        itens: [
            { quantidade: 2, nome: 'Item A', preco: 10 },
            { quantidade: 1, nome: 'Item B', preco: 20 }
        ]
    });

    // Get complete client data
    const pedido_cliente = cliente.getPedido()
    cliente.setDataAtual()
    const clientData = cliente.getDadosCompletos(pedido_cliente);

    // Generate and save the JSON file using the pedido data
    cliente.gerarPedidoJson(clientData);

    console.log(clientData)

}

main_cliente();