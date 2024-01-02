const { NlpManager } = require('node-nlp');
const Sentiment = require('sentiment');
const fs = require('fs');
const readline = require('readline');
const Widgets = require('../widgets/Widgets');

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const csvParser = require('csv-parser');
const GroundonView = require('../../views/GroundonView');

//TODO Robo tem que ter um botão: “voltar” e começar tudo novamente e usar isso com o nlp


class MewTwo {
    constructor() {
        this.initializeProperties();
        this.initializeNLP();

    }

    initializeProperties() {
        this.sentimento = new Sentiment();
        this.counter = 0;
        this.conversation = [];
        this.widgets = new Widgets()
        this.currentClient = null
    }

    initializeNLP() {
        this.manager = new NlpManager({ languages: ['pt'] });
        this.addTrainingData();
        this.manager.train();
    }

    // Método para definir o cliente atual
    setClient(client) {
        this.currentClient = client;
    }


    // Método para adicionar uma mensagem à conversa
    addMessageToConversation(sender, message) {
        this.conversation.push({ sender, message });
    }

    // Método para salvar a conversa em um arquivo CSV
    saveConversationClienteGroundon() {
        const filePath = path.join(__dirname, 'conversations.csv'); // Defina o caminho desejado aqui
        let csvContent = 'Sender,Message\n'; // Cabeçalho CSV

        for (let entry of this.conversation) {
            csvContent += `"${entry.sender}","${entry.message}"\n`; // Adicione cada entrada da conversa
        }

        fs.writeFileSync(filePath, csvContent, 'utf8');
        console.log(`Conversa salva em: ${filePath}`);
    }
    //!Treinamento e aprendizaado
    addTrainingData() {
        const { intents, responses } = this.getIntentsAndResponses();
        for (const intent in intents) {
            intents[intent].forEach(phrase => this.manager.addDocument('pt', phrase, intent));
            responses[intent].forEach(response => this.manager.addAnswer('pt', intent, response));
        }
    }

    async readCSVForTraining() {
        const results = [];
        const filePath = 'repository/mensagens_nlp.csv';

        if (!fs.existsSync(filePath)) {
            console.warn('O arquivo CSV não foi encontrado!');
            return results;
        }

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                });
        });
    }

    async trainWithCSVData() {
        const trainingData = await this.readCSVForTraining();
        trainingData.forEach(data => {
            this.manager.addDocument('pt', data.Mensagem, data.Intent);
        });
        await this.manager.train();
    }

    getIntentsAndResponses() {
        return {
            intents: {
                saudacao: ['boa noite', 'boa tarde', 'bom dia', 'alo', 'olá', 'oi', 'hello'],

                despedida: ['obrigado e tchau', 'te vejo mais tarde', 'aguardo o pedido'],

                pedido: ['fazer pedido', 'quero ver o menu', 'me mostre o cardapio', 'gostaria de pedir a promoção', 'fazer um pedido', 'fazer um pedido de delivery', 'fazer um delivery', 'entregar comida', 'quero uma pizza', 'quero um hambúrguer'],

                estagio1: ['iniciar', 'começar', 'olá de novo'],
                estagio2: ['meu nome é', 'chamo-me', 'telefone é'],
                estagio4: ['escolher produto', 'quero uma pizza'],
                estagio5: ['endereço é', 'entregar em', 'morada'],
                estagio6: ['complemento é', 'apartamento', 'bloco'],
                estagio7: ['pagar com', 'forma de pagamento', 'dinheiro ou cartão'],
                estagio8: ['confirmar pedido', 'tudo certo', 'finalizar pedido'],
                estagio9: ['pedido foi entregue?', 'status do pedido', 'pedido está pronto?'],

                reclamacao: ['não gostei', 'teve um problema', 'quero reclamar'],

                consulta: ['quero ver onde esta meu pedido', 'quero fazer uma consulta', 'quero ver o andamento do pedido', 'consulta de pedidos'],

                erro: ['Fiz meu pedido errado', 'Preciso ajustar meu pedido', 'To com erro'],
                location: [' Onde fica o estabelecimento', 'Localização', 'Qual o endereço de voces?', 'Endereço', 'Local da loja'],
                promo: ['Promoção', 'Promoções', 'Qual a promoção?'],
                horarios: ['Qual o horario de atendimento', 'Horário', 'Horario de funcionamento', 'Que horas voes estao abertos?', 'Voces estao funcionando?'],

                elogio: ['adorei', 'excelente serviço', 'muito bom'],

                ajuda: ['não entendi', 'como funciona?', 'me ajude']
            },
            responses: {
                saudacao: ['Olá, como posso ajudar você?', 'Oi, tudo bem?'],
                despedida: ['Até logo!', 'Aguardo seu próximo pedido!'],
                pedido: ['De uma olhada no nosso cardapio e faça seu pedido :)', 'Faça seu pedido com calma'],
                estagio1: ['Bem-vindo de volta! Como posso ajudar?'],
                estagio2: ['Qual é o seu nome e telefone?'],
                estagio4: ['Qual produto você gostaria de escolher?'],
                estagio5: ['Por favor, forneça o seu endereço de entrega.'],
                estagio6: ['Há algum complemento para o seu endereço?'],
                estagio7: ['Como você gostaria de pagar?'],
                estagio8: ['Por favor, confirme seu pedido.'],
                estagio9: ['Seu pedido está sendo preparado.'],
                reclamacao: ['Lamento ouvir isso. Por favor, nos dê mais detalhes para que possamos ajudar.'],
                elogio: ['Muito obrigado pelo seu feedback positivo!'],
                erro: ['Sem problemas, vamos consertar isso.'],
                consulta: ['Okay, vamos ver o andamento do pedido do ID 4522'],
                location: ['Nossa localização é em Botafogo e Copacabana'],
                promo: ['A promoção de hoje é: Bauro por 12 reais'],
                horarios: ['Nosso horario de funcionamento é de 8h ate as 22h'],
                ajuda: ['Claro! Como posso ajudar você hoje?']
            }
        };
    }

    getResponseForIntent(intent) {
        const { responses } = this.getIntentsAndResponses();

        return responses[intent] ? responses[intent][0] : "Desculpe, não entendi.";
    }

    salvarConversaEmCSV() {
        let dataCSV = "";
        const filePath = 'repository/mensagens_nlp.csv';

        // Se o arquivo não existir, adicione o cabeçalho
        if (!fs.existsSync(filePath)) {
            dataCSV += "Mensagem,Intent\n";
        }

        this.conversation.forEach((entry) => {
            dataCSV += `"${entry.message}", "${entry.intent}"\n`;
        });

        // Salvar no arquivo CSV (anexando ao final)
        fs.appendFileSync(filePath, dataCSV, 'utf-8');
        console.log(`Conversa salva no arquivo CSV! no arquivo ${filePath}`);
    }


    storeMessage(message, intent) {
        if (message && message.trim() !== "") {
            this.conversation.push({ message, intent });
        } else {
            console.warn('Mensagem inválida recebida: ', message);
        }
    }


    async processIntent(text) {
        this.counter++;
        const result = await this.manager.process('pt', text);
        return result;
    }


    analyzeSentiments(text) {
        try {
            return this.sentimento.analyze(text);
        } catch (error) {
            console.warn('Não foi possível analisar os sentimentos: ', error);
        }
    }

    generateDynamicResponse(intent) {
        switch (intent) {
            case 'saudacao':
                return 'Olá, como posso ajudar você?';
            case 'despedida':
                return 'Até logo!';
            case 'pedido':
                return 'Você gostaria de fazer um pedido?';
            case 'ajuda':
                return 'No que posso te ajudar?'
            default:
                return 'Desculpa nao entendi, voce quis dizer [opção1,opção2,opção3]?';
        }
    }

    getStageForIntent(intent) {
        const intentToStageMapping = {
            saudacao: 1,
            despedida: 9,
            pedido: 3,
            endereco: 5,
            pagamento: 7
            // ... mapeie todas as intenções para seus estágios correspondentes
        };
        return intentToStageMapping[intent];
    }

    //!Funções de Limpeza e tratamento de texto
    cleanText(text) {
        return text.toLowerCase().replace(/[^a-z\s]/gi, '');
    }

    removeStopWords(text) {
        const stopWords = ['e', 'o', 'a', 'de', 'que', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua'];
        const tokens = tokenizer.tokenize(text);
        return tokens.filter(token => !stopWords.includes(token)).join(' ');
    }

    stemText(text) {
        return natural.PorterStemmer.stem(text);
    }

    addDocumentToTfIdf(doc) {
        if (!this.tfidf) {
            this.tfidf = new natural.TfIdf();
        }
        this.tfidf.addDocument(doc);
    }

    getTfIdfScore(text) {
        const result = [];
        if (!this.tfidf) {
            console.warn("TF-IDF não foi inicializado.");
            return result;
        }
        this.tfidf.listTerms(0).forEach(item => {
            result.push({
                term: item.term,
                tfidf: item.tfidf
            });
        });
        return result;
    }

    //!Testando Chatbot
    async runChatbot() {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const interact = async () => {
            rl.question('\nDigite uma mensagem (ou "!sair" para encerrar): ', async userInput => {
                if (userInput.toLowerCase() === '!sair') {
                    this.salvarConversaEmCSV();
                    rl.close();
                    return;
                }



                const intentFromWidget = this.widgets.getIntentFromOption(this.widgets.menuPrincipal, userInput);

                let intentResponse;
                if (intentFromWidget) {
                    intentResponse = { intent: intentFromWidget };
                } else {
                    intentResponse = await this.processIntent(userInput);
                }

                const sentimentsAnalysis = this.analyzeSentiments(userInput);
                const dynamicResponse = this.generateDynamicResponse(intentResponse.intent);

                // Mostrando a resposta da intenção, análise de sentimentos e resposta dinâmica no terminal
                console.log('\n\nAnálise de Sentimentos: ', sentimentsAnalysis);
                console.log('\n\nResposta da Intenção: ', intentResponse);
                //console.log('\n\nResposta Dinâmica: ', dynamicResponse);


                const cleanIntent = intentResponse.intent.trim().replace(/"/g, '');
                const response = this.getResponseForIntent(cleanIntent);
                console.log('\n\nResposta:', response);



                //Mostrando o Menu
                let menu = this.widgets.enviarMenu('Menu Principal', this.widgets.menuPrincipal)
                console.log(menu)

                rl.question('\nA resposta foi correta? (sim/nao): ', async feedback => {
                    if (feedback.toLowerCase() === 'nao') {
                        rl.question('Qual seria a intenção correta?: ', async correctIntent => {
                            // Armazenar a correção para treinamento
                            this.manager.addDocument('pt', userInput, correctIntent);
                            await this.manager.train();
                            this.storeMessage(userInput, correctIntent);
                            this.saveConversationToCSV();
                            interact();
                        });
                    } else {
                        this.storeMessage(userInput, intentResponse.intent);
                        interact();
                    }
                });
            });
        };
        interact();
    }


}


// Exportação e Inicialização do MewTwo
module.exports = MewTwo;
const mewTwo = new MewTwo();
mewTwo.trainWithCSVData().then(() => {
    //mewTwo.runChatbot();
    console.log('MewTwo online')
});
