

// Definição das classes de chatbot
class DeliveryChatbot {
    async handle(message, cliente) {
        await cliente.sendText(message.from, 'Você escolheu Delivery. Como posso ajudá-lo com sua entrega?');
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



