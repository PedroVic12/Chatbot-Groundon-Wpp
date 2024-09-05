const fs = require('fs');
const axios = require('axios');

const Groundon = require('../models/Groundon');
const GroundonView = require('./GroundonView');
const MewTwo = require('../models/IA Models/MewTwo_NLP_IA')

const Cliente = require('../models/Regras de Negocio/Cliente/Cliente')

const Widgets = require('../models/widgets/Widgets')

//const Stage1 = require('./Stages/Estagio1')
const Estagio2 = require('./Stages/Estagio2');
const Estagio3 = require('./Stages/Estagio3');

const cliente = new Cliente()



//para pegar o audio
const mime = require('mime-types');


/*
TODO 

Robo fazer consulta de dados pelo ID do pedido e telefone

Vai conseguir colocar “raio de atendimento” ? 
Pra direcionar o pedido pra loja A ou B e quem estiver fora da área, ser avisado que não dá pra prosseguir?

Mas mesmo cada loja tendo um número tem que ter um “você está fora da área de entrega”
*/


class StagesView extends GroundonView {
    constructor(whatsapp, groundonController, backendController, model) {
        super(whatsapp, groundonController, backendController);
        //this.estagio1 = new Stage1()
        this.estagio2 = new Estagio2()
        this.estagio3 = new Estagio3()
        this.clientes = {};
        this.Widgets = new Widgets()

        this.isNLPMode = false;
        this.mewTwo = new MewTwo();  // Instantiate MewTwo in the constructor

        this.dailyOrderCount = {}; // Armazena a contagem diária de pedidos por número de telefone

        this.GENAI = model


    }


    incrementOrderCount(phoneNumber) {
        if (!this.dailyOrderCount[phoneNumber]) {
            this.dailyOrderCount[phoneNumber] = 0;
        }
        this.dailyOrderCount[phoneNumber]++;
    }

    resetDailyOrderCount() {
        this.dailyOrderCount = {};
    }

    async start_chatbot_IA(message) {
        this.isNLPMode = true;
        this.enviarMensagem(message, 'Olá, sou o Mewtwo. Você está agora no modo de treinamento  NLP. Digite "!sair" para sair.');
    }


    async getTypeMessage(message) {
        try {
            console.log(`Tipo msg: ${message.mimetype}`)

            if (message.isMedia === true || message.isMMS === true) {
                const buffer = await this.whatsapp.decryptFile(message);
                // At this point you can do whatever you want with the buffer
                // Most likely you want to write it into a file
                const fileName = `some-file-name.${mime.extension(message.mimetype)}`;
                //fs.writeFileSync(fileName, buffer);
                console.log(buffer)
            }
        } catch (error) {
            console.log("Erro ao conseguir pegar o tipo de msg")
        }
    }

    async mewtwoProcessa(message) {
        try {
            // Processar a mensagem usando MewTwo
            const resposta_intent = await this.mewTwo.processIntent(message.body);

            const cleanIntent = resposta_intent.intent.trim().replace(/"/g, '');
            const resposta = this.mewTwo.getResponseForIntent(cleanIntent);
            //console.log(`Debug: ${resposta} | ${resposta_intent} `)

            // Se a resposta foi bem-sucedida, envie a resposta para o usuário
            if (resposta) {

                this.enviarMensagem(message, `Resp. Mewtwo: ${resposta}`);
                //this.enviarMensagem(message, resposta);

            } else {
                this.enviarMensagem(message, 'Desculpe, não consegui entender sua mensagem.');
            }

            // Obter o estágio com base na intenção
            const stage = this.mewTwo.getStageForIntent(resposta_intent.intent);

            // Se um estágio foi identificado, navegue para ele
            if (stage) {
                this.pushStage(stage);
                this.navigateToStage(stage);
                console.log(`\n\nStage of Mewtwo: ${stage}`);
            } else {
                console.log('\n\nResposta Mewtwo fora do Groundon')
            }
        } catch (error) {
            console.error('Erro ao processar a mensagem:', error);
            this.enviarMensagem(message, 'Desculpe, ocorreu um erro ao processar sua mensagem.');
        }
    }


    async mewtwoRespondeItemDoMenu(selectedOption) {
        const texto_item_selecionado = selectedOption.button.text.slice(3);
        const resposta_choice = await this.mewTwo.processIntent(texto_item_selecionado);

        this.enviarMensagem(message, `Voce escolheu a opção *${texto_item_selecionado}*`);
        this.enviarMensagem(message, resposta_choice.answer);

        // Você pode adicionar mais lógica aqui se necessário para ações específicas do menu.
    };

    async mewtwoRespondeMensagem(message) {
        const resposta_intent = await this.mewTwo.processIntent(message.body);
        const cleanIntent = resposta_intent.intent.trim().replace(/"/g, '');
        const resposta = this.mewTwo.getResponseForIntent(cleanIntent);

        // Se a resposta foi bem-sucedida, envie a resposta para o usuário.
        if (resposta) {
            return { cleanIntent, resposta }
        }

    };

    async genaiResponde(num_stage, message) {
        try {
            const chat = await this.GENAI.runChatBot();


            if (num_stage == 1){

                let mensagemGemini = await this.GENAI.sendMsg(chat, `Olá! é do robo delivery? ${message.body}`)
                console.log("\n\nRobo IA Gemini: ",mensagemGemini);
                return mensagemGemini;
            } else if (num_stage == 2){
                let mensagemGemini = await this.GENAI.sendMsg(chat, `Meu Nome é: ${message.body}, sempre me chame pelo nome!`)
             
                console.log("\n\nRobo IA Gemini: ",mensagemGemini);
                return mensagemGemini;
            } else {
                let mensagemGemini = await this.GENAI.sendMsg(chat, `${message.body}`)
                console.log("\n\nRobo IA Gemini: ",mensagemGemini);
                return mensagemGemini;

            }

        

            //if (num_stage > 2) {
            //    return mensagemGemini;
            //}
        } catch (error) {
            console.error('Erro ao processar o gemini:', error);

        }
    }


    resetEstagio(message, num_stage, phone) {

        if (message.body === "!voltar") {
            const previousStage = num_stage - 2; // Get the previous stage from the stack

            if (previousStage) {
                this.setClientStage(phone, previousStage) // Set the previous stage as the current stage
                this.enviarMensagem(message, "Voltando para o estágio anterior.");
            } else {
                this.enviarMensagem(message, "Não é possível voltar mais.");
            }
            return;
        }
    }

    async start_chatbot_Groundon() {

        //! Variáveis GLOBAIS
        const menu_principal = this.Widgets.menuPrincipal;
        const menu_formaPagamento = this.Widgets.menuPagamento;
        let ID_PEDIDO = ''
        let KYOGRE_LINK_ID = ''
        let msgGemini = ""


        //!EVENTO DE ESPERAR MENSAGENS DO WHATSAPP
        this.whatsapp.onMessage(async (message) => {

            console.log('\n\nGroundon esperando mensagens...')
            console.log(`\n\nMEWTWO LIGADO ${this.isNLPMode}`)

            //!Tratamento quanto nao esta ligado

            //!Configurações de Conversa
            this.armazenarConversa(message);
            console.log(this.conversa)
            console.log(`Mensagem recebida: ${message.body}`)
            //this.mewTwo.salvarConversaEmCSV()

            //! Configurações de Estagios de Fluxo
            const phoneNumber = message.from;
            console.log('Novo telefone detectado!', phoneNumber,)

            // Inicializa o estado do cliente se não existir
            if (!this.clientStates[phoneNumber]) {
                this.clientStates[phoneNumber] = {
                    stack: [1] // Começa no estágio 1
                };
            }
            console.log('\n\n\n\n==================================================')
            console.log('Cliente Fazendo atendimento :\n', this.clientStates)
            console.log('==================================================\n\n\n')

            let numero_estagio
            numero_estagio = this.clientStates[phoneNumber].stack[this.clientStates[phoneNumber].stack.length - 1];


            //!Configurações Backend
            this.restartChatbot()

            //todo outra func global
            try {
                this.resetEstagio(message, numero_estagio, phoneNumber) // Função que reseta os estagios

            } catch (error) {
                console.log('nao vai dar para voltar de estagio')
            }

            //! Configurações de IA
            if (this.isNLPMode) {
                if (message.body.toLowerCase() === '!sair') {
                    this.isNLPMode = false;

                    try {
                        this.mewTwo.salvarConversaEmCSV();

                    } catch (error) {
                        console.log('Erro ao salvar conversa em CSV', error);
                    }

                    this.enviarMensagem(message, 'Você saiu do modo de NLP e voltou ao chatbot padrão.');
                } else {
                    this.mewtwoRespondeMensagem(message);
                    return;
                }
            } else {
                if (message.body === '!startIA') {
                    this.start_chatbot_IA(message);

                } else {
                    // ... [existing logic to process message with the standard chatbot]
                    
                    
                    // ia generativa
                    msgGemini = await this.genaiResponde(numero_estagio, message) 
                    await this.getTypeMessage(message)


                    // Processa a entrada usando MewTwo
                    //! ===================== Estágio 1 - Apresentação =====================
                    if (numero_estagio === 1) {
                        console.log(`\n\n\nEstágio ${numero_estagio}:`, message.body);
                        console.log(typeof (message.body))

                        await this.delay(1000).then(
                            this.enviarMensagem(message, `Bem-vindo a Lanchonete!\n🤖 Eu sou o Robô Atendente Virtual *Groundon Bot* e estou aqui para levar seu atendimento a outro nivel.`)
                        )
                        this.clientStates[phoneNumber].stack.push(2);
                        await this.delay(3000).then(
                            this.enviarMensagem(message, "🤖 Antes de começarmos, por favor, *Digite Seu Nome:*")
                        )


                    }
                    //!=====================  Estágio 2 - Mostrar Menu Principal =====================
                    else if (numero_estagio === 2) {
                        console.log(`\n\n\nEstágio ${numero_estagio}:`, message.body);

                        const iniciandoAtendimentoPeloTelefone = async () => {

                            if (!phoneNumber) {
                                console.error('Error - phoneNumber is undefined or null');
                                return;
                            }

                            if (!this.clientStates[phoneNumber]) {
                                this.clientStates[phoneNumber] = {
                                    stack: [2],  // If it's initializing at stage 2, then the stack should start with 2.
                                    cliente: new Cliente()
                                };

                                // Defina o cliente para MewTwo
                                this.mewTwo.setClient(this.clientStates[phoneNumber].cliente);

                            }

                            if (!this.clientStates[phoneNumber].cliente) {
                                console.log('\nNovo Cliente detectado!');
                                this.clientStates[phoneNumber].cliente = new Cliente();
                            }


                            try {
                                const nomeCLiente = this.getLastMessage(message);
                                const numCliente = this.estagio2.getTelefoneCliente(message);
                                ID_PEDIDO = this.backendController.gerarIdPedido();

                                // Set values
                                this.clientStates[phoneNumber].cliente.setNome(nomeCLiente);
                                this.clientStates[phoneNumber].cliente.setTelefone(numCliente);
                                this.clientStates[phoneNumber].cliente.setId(ID_PEDIDO);


                                // Incrementa o contador de pedidos para o número de telefone
                                this.incrementOrderCount(numCliente);


                                //Enviando dados para o backEnd
                                await this.backendController.enviarDadosClienteServidor(this.clientStates[phoneNumber].cliente, ID_PEDIDO);
                                KYOGRE_LINK_ID = await this.backendController.enviarLinkServidor(ID_PEDIDO);

                                console.log('\n\nDados Coletados!')
                                console.log(this.clientStates[phoneNumber].cliente);


                            } catch (error) {
                                console.log('Não foi possível fazer uma conexão no backend', error);
                            }
                        }
                        await iniciandoAtendimentoPeloTelefone()

                        await this.delay(2000).then(
                            //TODO se cliente não existir, cadastrar cliente

                            //TODO se cliente existir, pegar dados do cliente

                            await this.enviarMensagem(message, `✅ Prazer em te conhecer, ${this.clientStates[phoneNumber].cliente.getNome()}!`)
                        )

                        this.enviarMensagem(message, `🤖 Seu numero de pedido é #${ID_PEDIDO}`)

                        // Mostra o menu principal
                        let menu_principal_text = this.Widgets.getMenuText('Menu Principal', menu_principal);
                        //this.enviarMensagem(message, menu_principal_text)
                        this.enviarMensagem(message, "O que posso te ajudar?")


                        this.clientStates[phoneNumber].stack.push(3);
                    }

                    //!=====================  Estágio 3 - Responde as funcionalidades do Botão =====================
                    else if (numero_estagio === 3) {
                        console.log(`\n\n\nEstágio ${numero_estagio}:`, message.body);
                        let cardapioEnviado = false;



                        //mensagem marketing
                        //this.enviarMensagem(message, `Nada melhor do que começar o dia com um dos nossos sucos fresquinhos, feitos com frutas selecionadas. 🍓🍍🥭
                        //                            \nDesde 1977 na esquina da Rua Barata Ribeiro com a Rua Rodolfo Dantas.
                        //                             \n#Lanches #Copacabana #SucosNaturais #FrutasFrescas 
                        //    `);



                        //nlp functions
                        let intent_escolhida;
                        const selectedOption = this.Widgets.getSelectedOption(menu_principal, message.body);
                        if (selectedOption) {
                            intent_escolhida = selectedOption.button.text.slice(3);
                            await this.enviarMensagem(message, `Voce escolheu a opção *${intent_escolhida}*`)
                        } else {
                            intent_escolhida = this.getLastMessage(message)
                        }


                        // MOdelo NLP Mewtwo
                        const resposta_intent = await this.mewTwo.processIntent(intent_escolhida);
                        const cleanIntent = resposta_intent.intent.trim().replace(/"/g, '');

                        const resposta = await this.mewTwo.getResponseForIntent(cleanIntent);
                        console.log(`Mewtwo intent NLP: ${resposta}`)
                        //await this.enviarMensagem(message, `Mewtwo: ${resposta}`)

                        // mandando cardapio
                        if (cleanIntent === 'pedido') {

                            cardapioEnviado = false

                            new Promise(async (resolve, reject) => {
                                this.enviarMensagem(message, resposta)
                                try {
                                    const result = await this.sendLinkCardapioDigital(message, KYOGRE_LINK_ID);
                                    resolve(result);
                                    cardapioEnviado = true

                                }
                                catch (error) {
                                    reject(error);
                                }
                            }).then(() => {
                                this.clientStates[phoneNumber].stack.push(4);
                                console.log('Enviado?', cardapioEnviado)

                            }).catch((error) => {
                                console.error('Erro ao enviar o link do cardápio:', error);
                            });

                        } else {


                            // enviar o menu se ele quer fazer o pedido
                            if (cleanIntent != 'pedido') {
                                // this.delay(60000).then(() => {
                                //     this.enviarMensagem(message, "Posso ajudar em mais alguma coisa? ")
                                // })
                                await this.enviarMensagem(message, msgGemini)

                            }

                        }
                    }



                    //!=====================  Estagio 4 - Cliente Escolhe os Produtos no Cardapio Digital da Loja =====================
                    else if (numero_estagio === 4) {
                        console.log(`\n\nEstágio ${numero_estagio}:`, message.body);
                        let MENSAGEM_STRING_WPP = ''
                        let msgEnviadaKyogre = this.getLastMessage(message)
                        let intentClienteCardapio = await this.mewTwo.processIntent(msgEnviadaKyogre)

                        await this.enviarMensagem(message, msgGemini)

                        // Pega os dados do cliente do Kyogre
                        const pedido_escolhido_cardapio = await this.backendController.getDadosPedidosKyogre(ID_PEDIDO)



                        //const intentPedidoFeito = await this.mewTwo.processIntent(msgEnviadaKyogre);
                        // if (intentPedidoFeito === 'pedidoCardapioFeito')


                        if (msgEnviadaKyogre == 'Pronto! fiz meu pedido!') {
                            if (pedido_escolhido_cardapio) {
                                const PRODUTOS = pedido_escolhido_cardapio
                                const CARRINHO = PRODUTOS['carrinho']


                                //a mensagem do resumo do pedido
                                for (let index = 0; index < CARRINHO.length; index++) {
                                    const item = CARRINHO[index]
                                    MENSAGEM_STRING_WPP += `\n-> ${item.quantidade}x - ${item.nome}`;
                                }

                                await this.enviarMensagem(message, `*Resumo do Pedido ${ID_PEDIDO}* ${MENSAGEM_STRING_WPP}`)


                                // Pega os dados do Cliente do KYOGRE
                                try {

                                    this.clientStates[phoneNumber].cliente.setPedido(PRODUTOS)

                                    console.log('\n\n\nPedido KYOGRE:\n', this.clientStates[phoneNumber].cliente.getDadosCompletos())

                                    this.delay(1000).then(
                                        this.enviarMensagem(message, `✅ Seu pedido foi anotado!`)
                                    )

                                } catch (error) {
                                    console.log('Nao foi possivel salvar os produtos do pedido', error)
                                }
                            }

                            this.delay(3000).then(
                                this.enviarMensagem(message, ` Boa escolha ${this.clientStates[phoneNumber].cliente.getNome()}!\n*Digite o seu endereço de entrega:*`)
                            )


                            this.clientStates[phoneNumber].stack.push(5);
                        }



                    }


                    //!=====================  Estagio 5 - Cliente coloca o endereço =====================
                    else if (numero_estagio === 5) {
                        console.log(`\n\nEstágio ${numero_estagio}:`, message.body);

                        //TODO VERIFICAR RAIO DE ALCANCE DO PEDIDO USANDO UMA API 
                        //LocationController


                        const endereco_entrega = this.getLastMessage(message);
                        this.clientStates[phoneNumber].cliente.setEndereco(endereco_entrega)

                        this.enviarMensagem(message, 'Seu endereço precisa de algum complemento? Digite Sim ou Não')
                        this.clientStates[phoneNumber].stack.push(6);
                    }


                    //!=====================  Estágio 6 - Pergunta sobre o complemento =====================
                    else if (numero_estagio === 6) {
                        console.log(`\n\nEstágio ${numero_estagio}:`, message.body);

                        const resposta_cliente = this.getLastMessage(message).toUpperCase().trim();

                        if (resposta_cliente === 'SIM') {
                            this.enviarMensagem(message, 'Digite seu complemento.');
                            this.clientStates[phoneNumber].stack.push(6.5);
                        } else if (resposta_cliente === 'NÃO' || resposta_cliente === 'NAO') {
                            this.clientStates[phoneNumber].cliente.setComplemento('Sem Complemento.')


                            // Mostra o menu principal
                            let menu_pagamento_text = this.Widgets.getMenuText('Digite a forma de pagamento', menu_formaPagamento);
                            this.enviarMensagem(message, menu_pagamento_text)
                            this.clientStates[phoneNumber].stack.push(7);
                        }
                    }

                    //!=====================  Estágio 6.5 - Coleta o complemento =====================
                    else if (numero_estagio === 6.5) {
                        console.log(`\nEstágio ${numero_estagio}:`, message.body);


                        const complemento = this.getLastMessage(message);
                        this.clientStates[phoneNumber].cliente.setComplemento(complemento);


                        // Mostra o menu principal
                        let menu_pagamento_text = this.Widgets.formatMenu('Digite a forma de pagamento', menu_formaPagamento);
                        this.enviarMensagem(message, menu_pagamento_text)
                        this.clientStates[phoneNumber].stack.push(7);
                    }


                    //! escolhe forma de pagamento
                    else if (numero_estagio === 7) {
                        console.log(`\n\nEstágio ${numero_estagio}:`, message.body);


                        //? Pega a ultima mensagem enviada pelo cliente
                        const forma_pagamento = this.getLastMessage(message)
                        const selectedOption = this.Widgets.getSelectedOption(menu_formaPagamento, forma_pagamento);


                        //todo debug UX
                        // Verifica qual opção
                        if (selectedOption) {
                            this.enviarMensagem(message, `Voce escolheu a opção *${selectedOption.button.text.slice(3)}*`)
                        }

                        this.clientStates[phoneNumber].cliente.setFormaPagamento(selectedOption.button.text.slice(3))


                        // TODO USAR O MENU E TRATAMENTO DE DADOS PARA 3 RESPOSTAS
                        const pedido_cliente = this.clientStates[phoneNumber].cliente.getPedido()
                        this.clientStates[phoneNumber].cliente.setDataAtual()
                        const DADOS_CLIENTE = this.clientStates[phoneNumber].cliente.getDadosCompletos();



                        try {

                            // Generate and save the JSON file using the pedido data

                            console.log('\n\n\n>>> DADOS DO CLIENTE:\n', DADOS_CLIENTE, '\n')

                            this.clientStates[phoneNumber].cliente.gerarPedidoJson(DADOS_CLIENTE);

                            // Enviando para o servidor
                            this.backendController.enviarPedidoRayquaza(DADOS_CLIENTE)

                        } catch (error) {
                            console.log('Erro ao fazer o post do pedido no servidor')
                        }


                        await this.delay(3000).then(
                            await this.enviarMensagem(message, 'Confirma o seu pedido?')
                        )
                        this.clientStates[phoneNumber].stack.push(8);


                    }

                    //!PEDIDO ENVIADO PARA COZINHA
                    else if (numero_estagio === 8) {
                        console.log(`\nEstágio ${numero_estagio}:`, message.body);
                        let mudou = false


                        const confirmacao = this.getLastMessage(message)

                        this.enviarMensagem(message, `*Obrigado, ${this.clientStates[phoneNumber].cliente.getNome()}*!\nSeu pedido foi enviado para cozinha e aguardo a confirmação!`)


                        this.delay(4000).then(
                            this.enviarMensagem(message, "Seu pedido foi confirmado e está sendo preparado.\nCaso precise modificar ou passar mais alguma informação para o atendente, ligue para (21)2222-2222 ")
                        )

                        // No final do estágio 8, antes de mudar para o próximo estágio:
                        try {
                            this.mewTwo.saveConversationClienteGroundon();
                        } catch (error) {
                            console.log('Erro ao salvar conversa em CSV', error);
                        }
                        this.clientStates[phoneNumber].stack.push(9);

                    }

                    //!PEDIDO PRONTO E ENVIADO PARA ENTREGA
                    else if (numero_estagio === 9) {
                        console.log(`\nEstágio ${numero_estagio}:`, message.body);


                        let state = await this.backendController.verificarStatusPedidos()
                        this.enviarMensagem(message, state)


                        this.enviarMensagem(message, 'O.O opa, Seu pedido está sendo preparado, caso precise modificar ou passar mais alguma informação para o atendente, ligue para (21)2222-2222.');

                        // Processa a entrada usando MewTwo
                        const resposta_intent = await this.mewTwo.processIntent(message.body);
                        const cleanIntent = resposta_intent.intent.trim().replace(/"/g, '');
                        const resposta = this.mewTwo.getResponseForIntent(cleanIntent);

                        if (cleanIntent === 'estagio9') {
                            this.enviarMensagem(message, resposta);
                        } else {
                            this.enviarMensagem(message, `Vamos verificando o status do pedido ${this.clientStates[phoneNumber].getId()} de ${this.clientStates[phoneNumber].cliente.getNome()}!`);
                        }
                    }



                }
            }


        });


    }

}

module.exports = StagesView;




/*
1 - boas vindas 
2- Pega o nome com cliente com o metodo do Groundon.getLastMessage() e salva no Cliente.nome
3- Aparece o menu principal onde a pessoa escolhe (Ver cardapio, Fazer Pedido, Ver localização)
4- O cliente faz a escolha e recebe a resposta
5- Ao fazer Pedido, aparece o Menu de Produtos onde o cliente escolhe qual Produto ele quer (comida, bebida, sobremesa, salgados, pizzas)
6 - O cliente escolhe o tipo de produto e recebe seu Cardapio
7 - O cliente faz o pedido e o Pedido é adicionado ao carrinho
8 - Aparece o MenuNavegacao onde o cliente escolhe se ele quer, [Continuar pedido, Ver Carrinho, Refazer Pedido, Finalizar Pedido]
9 - O cliente faz a sua escolha e recebe a resposta apropriada
10 - Se o cliente finaliza o pedido, ele vai para o Menu Pagamento onde ele escolhe [Cartao, Dinheiro, Pix)
11 - Menu de confirmacao Voce confirma? __forma_pagamento -> [Sim, Nao]
12 - O bot groundon pergunta o endereço de entrega
13 - O cliente responde o endereço
14 - O bot salva o endereço  no Cliente.endereco_entrega
15 - Aparece o MenuResumoPedido do Pedido e diz que o pedido foi enviado para o atendente e cospe o pedido em formato .json

*/