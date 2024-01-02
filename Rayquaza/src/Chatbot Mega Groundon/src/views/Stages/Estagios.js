// estagios.js
const StagesView = require('./caminho_para_StagesView'); // Substitua pelo caminho correto para o arquivo StagesView.

class Estagios extends StagesView {
    constructor(whatsapp, groundonController, backendController) {
        super(whatsapp, groundonController, backendController);
    }

    async stage1(message) {
        // ... (todo o código do estágio 1 aqui)
    }

    async stage2(message) {
        // ... (todo o código do estágio 2 aqui)
    }

    async stage3(message) {
        // ... (todo o código do estágio 3 aqui)
    }
}

module.exports = Estagios;


/*

class StagesView extends GroundonView {
    constructor(whatsapp, groundonController, backendController) {
        super(whatsapp, groundonController, backendController);
        this.estagios = new Estagios(whatsapp, groundonController, backendController);
    }

    // ...

    async start_chatbot_Groundon() {
        // ...

        this.whatsapp.onMessage(async (message) => {
            // ...

            if (numero_estagio === 1) {
                await this.estagios.stage1(message);
            } else if (numero_estagio === 2) {
                await this.estagios.stage2(message, cliente);
            } else if (numero_estagio === 3) {
                await this.estagios.stage3(message, cliente);
            }

            // ...
        });
    }
}

*/