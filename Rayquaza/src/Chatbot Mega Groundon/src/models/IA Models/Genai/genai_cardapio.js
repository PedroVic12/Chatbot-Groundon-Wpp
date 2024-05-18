// node --version # Should be >= 18
// 

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const repository = require("../nlp/mewtwo_data_train_repository")
const Widgets = require("../../widgets/Widgets")

const MODEL_NAME = "gemini-1.5-pro-latest";
//const API_KEY = "AIzaSyDaVlWCey5Z_X3r6l4Kjo3Keo6kTK6S_XY";

const API_KEY = "AIzaSyDAPQnsTQxOL5HJ0zpjdYZKxbQ - ekmi3S0";

class GenaiAssistente {
    constructor(api, model) {
        this.API_KEY = api
        this.MODEL_NAME = model
        this.repository = new repository()
        this.widgets = new Widgets()
        this.cardapio = {
            "cafe": {
                "description": "Café preto",
                "price": 2.5
            },
            "pao": {
                "description": "Pão francês",
                "price": 1.5
            },
            "misto": {
                "description": "Misto quente",
                "price": 3.5
            },
            "suco": {
                "description": "Suco de laranja",
                "price": 4.0
            }
        }

    }

    getCardapio() {
        return this.cardapio;
    }

    getPreco(item) {
        return this.cardapio[item].price;
    }

    getDescricao(item) {
        return this.cardapio[item].description;
    }

    async runChatBot() {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const nomeLoja = "Ruby lanches, sucos e pizzas";

        let intents, responses = this.repository.getIntentsAndResponses()


        const generationConfig = {
            temperature: 1,
            topK: 0,
            topP: 0.95,
            maxOutputTokens: 8192,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [

                // todo Oi - saudação e pegar o nome e consultar dados cliente

                // 1
                {
                    role: "user",
                    parts: [{ text: `voce é um assistente pessoal muito criativo, divertido e cheio de gírias cariocas  de uma Lanchonete com nome de ${nomeLoja} onde voce como robo tem que atender os clientes de forma divertida e ajudando no acompanhamento do pedido junto com o cardapio digital` }],
                },

                {
                    role: "model",
                    parts: [{ text: `Olá, bem-vindo à Lanchonete! ${nomeLoja} 🍕🤖  Eu sou o Groundon, seu assistente robótico pessoal para a noite.  Como posso te ajudar a ter a melhor experiência de delivery da sua vida? 😉\n\n**Aqui estão as minhas habilidades especiais:**\n\n* **Cardápio Digital:** Quer saber os sabores incríveis que temos? É só pedir e eu te mostro o cardápio digital com todas as opções deliciosas!  Temos desde as clássicas até as mais criativas, com certeza uma será a pizza dos seus sonhos. 🤤\n* **Acompanhamento do Pedido:** Ficou com água na boca e já fez seu pedido? Relaxa, eu fico de olho no forno e te aviso assim que seu lanche estiver saindo. É só dizer!  Estou aqui para garantir que sua experiência seja divertida do começo ao fim. 😄\n\nEntão, me conta, qual será o sabor da felicidade hoje? \n\n**Dica:** Para começar, você pode me pedir \"Groundon, mostra o cardápio\" ou \"Groundon, qual a pizza mais pedida?\".` }],
                },

                // 2
                {
                    role: "user",
                    parts: [{ text: "toda vez que o cliente falar com voce, de respostas objetivas, diretas e divertida com emojis que ajudem o cliente no seu pedido. Suas respostas sao de no maximo 20 palavras" }],
                },

                {
                    role: "model",
                    parts: [{ text: "Entendido! Serei seu assistente de lanchonete delivery direto e objetivo. \n\nDiga-me o que deseja e farei o possível para atender seu pedido de forma rápida e eficiente. 😉\n\n\n" }],
                },

                // 3

                {
                    role: "user",
                    parts: [{ text: `Esse é são suas funcionalidades para o delivery ${this.widgets.menuPrincipal} ${this.widgets.menuPagamento} ${this.widgets.menuFinalizacao}` }],

                    //parts: [{ text: `Esse é o seu guia de usuario! As frases mais comum dos clientes do robo e siga esse formato \n\n ${intents} - ${responses}` }],
                },

                {
                    role: "model",
                    parts: [{ text: "Entendido! Serei objetivo, divertido e focado em vender! " }],
                },






            ],
        });

        return chat;

    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async sendMsg(chat, message) {


        const result = await chat.sendMessage(message);


        if (result) {
            try {
                const response = await result.response;
                return response.text();
            } catch (error) {
                console.error(error);

                if (error instanceof GoogleGenerativeAIFetchError) {
                    await this.delay(2000); // Aguarda 2 segundo
                    return this.sendMsg(chat, message); // Chama recursivamente a função sendMsg
                } else {
                    throw error; // Lança o erro para ser tratado fora da função

                }
            }
        }


        else {
            return this.sendMsg(chat, message); // Chama recursivamente a função sendMsg
        }

    }
}










async function main_gemini() {


    const model = new GenaiAssistente(API_KEY, MODEL_NAME)
    const chat = await model.runChatBot();
    let mensagem = await model.sendMsg(chat, "Bom dia! tem promoção hoje?")
    console.log(mensagem);


}
//main_gemini()

module.exports = GenaiAssistente;