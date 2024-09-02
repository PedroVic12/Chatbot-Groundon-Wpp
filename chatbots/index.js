const wppconnect = require('@wppconnect-team/wppconnect');
const { DeliveryChatbot, AtendenteChatbot, AgendamentoChatbot } = require('./group_manager/bots');

// Classe principal Bot
class ChatBotWpp {
    constructor(wpp) {
        this.wpp = wpp;
        this.atendenteChatbot = new AtendenteChatbot();
        this.agendamentoChatbot = new AgendamentoChatbot();
        this.deliveryChatbot = new DeliveryChatbot();
        this.clientStates = {}; // Armazenar estados dos clientes
    }

    // Função para atualizar o estado do cliente
    updateClientState(phoneNumber, state, message) {
        if (!this.clientStates[phoneNumber]) {
            this.clientStates[phoneNumber] = { stack: [] };
        }
        this.clientStates[phoneNumber].stack.push(state);
        this.clientStates[phoneNumber].message = message;
    }

    // Função para obter o estágio atual do cliente
    getClientState(phoneNumber) {
        return this.clientStates[phoneNumber] || { stack: [], message: '' };
    }

    // Função para remover o estágio atual
    popStage(phoneNumber) {
        if (this.clientStates[phoneNumber]) {
            this.clientStates[phoneNumber].stack.pop();
        }
    }

    // Função para obter o estágio atual
    getCurrentStage(phoneNumber) {
        const state = this.getClientState(phoneNumber);
        return state.stack.length > 0 ? state.stack[state.stack.length - 1] : null;
    }

    async conectarWpp() {
        return new Promise(async (resolve, reject) => {
            try {
                this.whatsapp = await this.wpp.create({
                    tokenStore: 'file',
                    folderNameToken: 'tokens',
                    session: 'bots' // Nome da sessão
                });

                if (this.whatsapp) {
                    console.log('\nConectado ao WhatsApp com sucesso! :) \n');
                    resolve(true);
                } else {
                    console.log(`Debug ${this.whatsapp}`);
                    reject(new Error("WhatsApp connection failed."));
                }
            } catch (error) {
                console.error('\n\nErro ao conectar ao WhatsApp:', error);
                reject(error);
            }
        });
    }

    async enviarMensagem(to, texto) {
        try {
            await this.whatsapp.sendText(to, texto);
        } catch (error) {
            console.error('\n\nErro ao enviar mensagem com wpp connect: ', error);
        }
    }
    async getLastMessage(message) {
		try {
			const lastMessage = message.body
			return lastMessage

		} catch (err) {
			console.log(err);
		}
	}
    async start() {
        this.whatsapp.onMessage(async (message) => {
            try {
                const phoneNumber = message.from;
                const currentStage = this.getCurrentStage(phoneNumber);
                let lastMessage = await this.getLastMessage(message)
                console.log('\nMensagem recebida:', lastMessage);

                if (message.body === '1') {
                    this.updateClientState(phoneNumber, 1, message.body);
                    await this.deliveryChatbot.handle(message, this.whatsapp, this);
                } else if (message.body === '2') {
                    //this.updateClientState(phoneNumber, 2, message.body);
                    await this.atendenteChatbot.handle(message, this.whatsapp);
                } else if (message.body === '3') {
                    //this.updateClientState(phoneNumber, 3, message.body);
                    await this.agendamentoChatbot.handle(message, this.whatsapp);
                } else if (currentStage === 1) {
                    // Continuar com o estágio 1 (Delivery)
                    await this.deliveryChatbot.runDelivery(message, this);
                } else {
                    await this.enviarMensagem(message.from, 'Desculpe, não entendi sua escolha. Por favor, escolha entre 1, 2 ou 3.');
                }
            } catch (error) {
                console.error('Error when processing message: ', error);
            }
        });
    }
}

async function run_chatbot() {
    try {
        const bot = new ChatBotWpp(wppconnect);

        await bot.conectarWpp();
        await bot.start();
    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
    }
}

run_chatbot();