const wppconnect = require('@wppconnect-team/wppconnect');

// Classe principal Bot
class ChatBotWpp {
    constructor(wpp) {
        this.wpp = wpp;
        this.deliveryChatbot = new DeliveryChatbot();
        this.atendenteChatbot = new AtendenteChatbot();
        this.agendamentoChatbot = new AgendamentoChatbot();
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
                    console.log('\nConectado ao WhatsApp com sucesso!');
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
            const result = await this.whatsapp.sendText(to, texto);
            // console.log('\n\nResultado da Mensagem: ', result);
        } catch (error) {
            console.error('\n\nErro ao enviar mensagem com wpp connect: ', error);
        }
    }
    getLastMessage(message) {
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
                
                await this.enviarMensagem(message.from, 'Olá, como posso ajudá-lo?\n1. Delivery\n2. Atendente\n3. Agendamento');
                 let lastMessage = this.getLastMessage(message)
                console.log('\n\nÚltima mensagem: ', lastMessage)   
                if (message.body === '1') {
                    await this.deliveryChatbot.handle(message, this.whatsapp);
                } else if (message.body === '2') {
                    await this.atendenteChatbot.handle(message, this.whatsapp);
                } else if (message.body === '3') {
                    await this.agendamentoChatbot.handle(message, this.whatsapp);
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
    const bot = new ChatBotWpp(wppconnect);
    try {
        await bot.conectarWpp();
        await bot.start();
    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
    }
}

run_chatbot();