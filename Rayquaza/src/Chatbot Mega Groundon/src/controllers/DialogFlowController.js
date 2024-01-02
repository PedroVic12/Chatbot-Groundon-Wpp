const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const dialogflow = require('@google-cloud/dialogflow');
const GroundonController = require('./GroundonController');

//TODO -> TENTATIVA DE MANDAR LISTAR PELO DIALOGFLOW + INTEGRAÇÃO COM AS INTENTES

class DialogFlow extends GroundonController {
    constructor() {
        super()
        this.app = express();
        this.app.post('/webhook', this.handleWebhookRequest.bind(this));
    }

    async handleWebhookRequest(request, response) {
        const agent = new WebhookClient({ request, response });
        let intentMap = new Map();
        intentMap.set('Botoes e Listas', this.nameFunction.bind(this));
        await agent.handleRequest(intentMap);
    }

    async nameFunction(agent) {
        // Implemente a lógica da função aqui
        const responseText = 'Resposta da intenção {nome_da_intencao}';
        agent.add(responseText);
    }

    async detectIntent(projectId, sessionId, query, contexts, languageCode) {
        const PATH_JSON = '/home/pedrov/Documentos/GitHub/Chatbot-Whatsapp/Chatbot - Delivary e Entregas/Chatbot Rayquaza x Groundon x Kyogre/Rayquaza/src/Chatbot Mega Groundon/chabot-370717-db4231f86949.json'
        const sessionClient = new dialogflow.SessionsClient({ keyFilename: PATH_JSON });
        const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                    languageCode: languageCode
                }
            }
        };

        const [response] = await sessionClient.detectIntent(request);
        const result = response.queryResult;
        return result;
    }

    async executeQueries(projectId, sessionId, queries, languageCode) {
        let responses = [];
        for (const query of queries) {
            const response = await this.detectIntent(projectId, sessionId, query, [], languageCode);
            responses.push(response);
        }
        return responses;
    }

    start_webhook() {
        const port = 1000;
        this.app.listen(port, () => {
            console.log(`DialogFlow webhook server is listening on port ${port}`);
        });
    }


    async start_DialogFlow() {
        await this.conectarWpp();

        this.whatsapp.onMessage(async (message) => {
            if (message.body === 'lista') {
                let texto_resposta = await this.executeQueries('chabot-370717', message.from, [message.body], 'pt-BR');

                const fulfillmentText = texto_resposta[0].fulfillmentText;
                console.log('\n\nResposta da Intent:', fulfillmentText);

                const args = fulfillmentText.split('|');
                const link1 = args[0].split('>');
                const link2 = args[1].split('>');


                const list_dialog = [
                    {
                        title: 'Escolha uma opção',
                        rows: [
                            {
                                title: link1[0],
                                description: link1[1]
                            },
                            {
                                title: link2[0],
                                description: link2[1]
                            }
                        ]
                    }
                ];


                console.log('\n\nOBJETO LISTA', list_dialog)




                await this.whatsapp.sendListMenu(
                    message.from,
                    'SEJA BEM VINDO',
                    'venom-bot',
                    '\nSelecione uma opção: \n' + message.body + '\n',
                    'CLIQUE AQUI',
                    list_dialog
                )
                    .then(() => {
                        console.log('Lista Enviada!'); //return object success
                    })
                    .catch((erro) => {
                        console.error('\N\NERROR LISTA', erro); //return object error
                    });
            }
        });
    }


}

module.exports = DialogFlow;


// Exemplo de uso
function run_dialog() {
    const dialogFlow = new DialogFlow();
    dialogFlow.start_webhook();
    dialogFlow.start_DialogFlow()
}

run_dialog()