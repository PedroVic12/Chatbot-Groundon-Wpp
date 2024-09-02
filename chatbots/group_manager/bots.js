const GenaiAssistente = require("../IA/delivery_chatbot_genai");


class DeliveryChatbot {
    async handle(message, cliente, bot) {
        await cliente.sendText(message.from, 'Você escolheu Delivery. Como posso ajudá-lo?');

        const initMessage = `🌞 Bom dia, Copacabana! 🌞
        \nNada melhor do que começar o dia com um dos nossos sucos fresquinhos, feitos com frutas selecionadas. 🍓🍍🥭
        \n📍 Desde 1977 na esquina da Rua Barata Ribeiro com a Rua Rodolfo Dantas.
        \n#Lanches #Copacabana #SucosNaturais #FrutasFrescas 
        `;

        await cliente.sendText(message.from, initMessage);
    }

    async runDelivery(message, bot) {
        try {
            const MODEL_NAME = "gemini-1.5-pro-latest";
            const API_KEY = "AIzaSyDAPQnsTQxOL5HJ0zpjdYZKxbQ-ekmi3S0";

            const model = new GenaiAssistente(API_KEY, MODEL_NAME);
            const chat = await model.runChatBot();

            const mensagem = await model.sendMsg(chat, message.body);
            console.log("Mensagem do Genai Delivery:", mensagem);
            await bot.enviarMensagem(message.from, mensagem);

        } catch (error) {
            console.error('Erro ao iniciar o bot:', error);
        }
    }
}
class AtendenteChatbot {
    async handle(message, cliente) {
        await cliente.sendText(message.from, 'Você escolheu Atendente. Como posso ajudá-lo com seu atendimento?');
    }
}

class AgendamentoChatbot {
    async handle(message, cliente) {
        await cliente.sendText(message.from, 'Você escolheu Agendamento. Como posso ajudá-lo a agendar?');
    }
}



exports.DeliveryChatbot = DeliveryChatbot;
exports.AtendenteChatbot = AtendenteChatbot;
exports.AgendamentoChatbot = AgendamentoChatbot;