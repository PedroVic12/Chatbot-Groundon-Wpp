const { body, validationResult } = require('express-validator');
const express = require('express');
const axios = require('axios')
const GroundonController = require('./GroundonController')
const net = require('net');



class BackendController extends GroundonController {
    constructor() {
        super();
        this.app = express();
        this.setupRoutes();
    }

    //!=====================================
    //! Funções de integração com o Rayquaza
    //!=====================================

    gerarIdPedido() {
        const pedidoId = Math.floor(1000 + Math.random() * 9000);
        return pedidoId
    }


    async getDadosPedidosKyogre(idPedido) {
        const url = `https://rayquaza-citta-server.onrender.com/pedidos-kyogre/${idPedido}`;
        try {
            const response = await axios.get(url);
            console.log('\n\n>>> Dados do pedido recebidos com sucesso:');
            //console.log(response.data)
            return response.data
        } catch (error) {
            console.error('Erro ao receber dados do KYOGRE:', error);
        }
    }


    async enviarLinkServidor(idPedido) {

        // Rota Cardapio Digital
        const link = `https://groundon-citta-cardapio.web.app/#/pedido/${idPedido}`;

        const url_link = 'https://rayquaza-citta-server.onrender.com/receber-link';
        const data_link = {
            link: link // inclua o link no objeto data_link
        };

        try {
            const response_link = await axios.post(url_link, data_link);
            console.log(`\n\n>>>Link: enviado com sucesso para o servidor FastAPI.\n`);

            //tratar response_link
            console.log('\nResposta do servidor -> ', response_link.data);
            console.log(`\n\n>>> link gerado: ${link}`);

            return link;

        } catch (error) {
            console.error('Erro ao enviar link:', error);
        }
    }


    async enviarDadosClienteServidor(cliente, idPedido) {
        // Rota Cliente
        const url = `https://rayquaza-citta-server.onrender.com/cliente/${idPedido}`;
        const data = {
            id: idPedido,
            nome: cliente.NOME_CLIENTE,
            telefone: cliente.telefone,
        };

        try {
            const response = await axios.post(url, data);
            console.log('\n\n>>> Dados do cliente enviados com sucesso:');
            console.log(response.data)
        } catch (error) {
            console.error('Erro ao enviar dados do cliente:', error);
        }



    }



    async enviarPedidoRayquaza(dados_pedido_cliente) {
        const url = 'https://rayquaza-citta-server.onrender.com/pedidos'; // URL do servidor FastAPI

        try {
            const response = await axios.post(url, dados_pedido_cliente, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log('\n\nPEDIDO ENVIADO COM SUCESSO!')
            } else {
                console.log('Falha ao enviar o pedido. Status:', response.status);
            }
        } catch (error) {
            console.error('Erro ao enviar o pedido:', error);
        }
    }


    //! Métodos BackEnd 

    checkPortInUse(port) {
        return new Promise((resolve, reject) => {
            const server = net.createServer();

            server.once('error', function (err) {
                if (err.code === 'EADDRINUSE') {
                    resolve(true);  // Porta está em uso
                } else {
                    reject(err);
                }
            });

            server.once('listening', function () {
                server.close();  // Fecha o servidor após ouvir o evento
                resolve(false);  // Porta não está em uso
            });

            server.listen(port);
        });
    }

    //Configurando Rotas
    setupRoutes() {
        this.app.use(express.json());

        // Rota para verificar o status do servidor
        this.app.get('/', (req, res) => {
            res.send('Tudo certo! O servidor está em execução.');
        });

        // Rota para receber o link do Cardapio Digital
        const linkSalvo = null; // Variável para armazenar o link recebido

        this.app.post(
            '/receber-link',
            [
                body('link').notEmpty().withMessage('O campo "link" não pode estar vazio.'),
            ],
            (req, res) => {
                // Extraia o link do corpo da solicitação
                linkSalvo = req.body.link;

                console.log('Link recebido:', linkSalvo);

                res.status(200).json({
                    status: true,
                    message: 'Link recebido com sucesso',
                });
            }
        );

        this.app.get('https://rayquaza-citta-server.onrender.com/receber-link', (req, res) => {
            if (linkSalvo) {
                res.status(200).json({ link: linkSalvo });
            } else {
                res.status(404).json({ message: 'Nenhum link foi recebido ainda.' });
            }
        });


        // Rota de enviar mensagem por HTTP
        this.app.post(
            '/send-message',
            [
                body('number').notEmpty().withMessage('O campo "number" não pode estar vazio.'),
                body('message').notEmpty().withMessage('O campo "message" não pode estar vazio.'),
            ],
            this.sendMessage.bind(this)
        );

        // Rota de enviar lista por HTTP
        this.app.post(
            '/send-lists',
            [
                body('to').notEmpty().withMessage('O campo "to" não pode estar vazio.'),
                body('title').notEmpty().withMessage('O campo "title" não pode estar vazio.'),
                body('subTitle').notEmpty().withMessage('O campo "subTitle" não pode estar vazio.'),
                body('description').notEmpty().withMessage('O campo "description" não pode estar vazio.'),
                body('menu').notEmpty().withMessage('O campo "menu" não pode estar vazio.'),

                body('option1').optional(),
                body('titulo1').optional(),
                body('descricao1').optional(),

                body('option2').optional(),
                body('titulo2').optional(),
                body('descricao2').optional(),
            ],
            this.sendLists.bind(this)
        );
    }

    // Rota para recuperar o link do Cardapio Digital
    async getLink() {
        const response = await axios.get('https://rayquaza-citta-server.onrender.com/receber-link');
        console.log('\n\nLink recuperado:', response.data.link);
        return response.data.link;
    }

    receberLink(request, response) {
        // Verifique se existem erros de validação nos campos do formulário
        const errors_request = validationResult(request);

        if (!errors_request.isEmpty()) {
            return response.status(422).json({
                status: false,
                message: errors_request.errors.map(error => error.msg)
            });
        }

        // Extraia o link do corpo da solicitação
        const link = request.body.link;

        console.log('Link recebido no nodejs :)', link);

        // Você pode fazer o que quiser com o link aqui. Por exemplo, você pode salvar
        // ele em um banco de dados, enviá-lo para outro serviço, etc.

        response.status(200).json({
            status: true,
            message: 'Link recebido com sucesso!',
        });
    }


    //! Enviar Mensagem por http
    sendMessage(request, response) {
        // Verifique se existem erros de validação nos campos do formulário
        const errors_request = validationResult(request);

        if (!errors_request.isEmpty()) {
            return response.status(422).json({
                status: false,
                message: errors_request.errors.map(error => error.msg)
            });
        }

        // Extraia o número de telefone e a mensagem do corpo da solicitação
        const cell_number = request.body.number;
        const mensagem = request.body.message;

        // Envie a mensagem usando a implementação existente
        client.sendText(cell_number, mensagem)
            .then(response => {
                response.status(200).json({
                    status: true,
                    message: 'Mensagem Enviada',
                    response: response
                });
            })
            .catch(error => {
                console.error('Erro ao enviar a mensagem:', error);
                response.status(500).json({
                    status: false,
                    message: 'Erro ao enviar a mensagem'
                });
            });
    }

    //!Enviar Listas
    sendLists(request, response) {
        // Verifique se existem erros de validação nos campos do formulário
        const errorsRequest = validationResult(request);

        if (!errorsRequest.isEmpty()) {
            return response.status(422).json({
                status: false,
                message: errorsRequest.errors.map((error) => error.msg),
            });
        }

        // Extraia os parâmetros da lista do corpo da solicitação
        const to = request.body.to;
        const title = request.body.title;
        const subTitle = request.body.subTitle;
        const description = request.body.description;
        const menu = request.body.menu;

        // Extrair itens da lista do menu
        const option1 = request.body.option1;
        const titulo1 = request.body.titulo1;
        const descricao1 = request.body.descricao1;

        const option2 = request.body.option2;
        const titulo2 = request.body.titulo2;
        const descricao2 = request.body.descricao2;

        // Objeto Lista
        const listMenu = [
            {
                title: option1,
                rows: [
                    {
                        title: titulo1,
                        description: descricao1,
                    },
                ],
            },
            {
                title: option2,
                rows: [
                    {
                        title: titulo2,
                        description: descricao2,
                    },
                ],
            },
        ];

        // Envie a lista usando a implementação existente
        this.enviarListaRequest(to, title, subTitle, description, menu, listMenu)
            .then((result) => {
                response.status(200).json({
                    status: true,
                    message: 'Lista Enviada',
                    result: result,
                });
            })
            .catch((error) => {
                console.error('Erro ao enviar a lista:', error);
                response.status(500).json({
                    status: false,
                    message: 'Erro ao enviar a lista',
                });
            });
    }

    async enviarListaRequest(to, title, subTitle, description, menu, listObject) {
        // Certifique-se de que as variáveis estejam definidas e contenham os valores esperados
        if (!to || !title || !subTitle || !description || !menu || !listObject) {
            throw new Error('Parâmetros ausentes ou inválidos.');
        }

        // Realize o envio da lista utilizando this.whatsapp.sendListMenu
        return this.whatsapp.sendListMenu(to, title, subTitle, description, menu, listObject);
    }

    //! Iniciar Servidor

    async checkServerStatus() {
        try {
            const response = await axios.get('https://rayquaza-citta-server.onrender.com'); // substitua por seu URL do servidor
            console.log('Server status:', response.data);
        } catch (error) {
            console.error('\n\nErro ao verificar o status do servidor:');
        }
    }



    async start_backend() {
        let port = 3000;
        const maxAttempts = 10;
        let attempt = 0;

        while (attempt < maxAttempts) {
            const isPortInUse = await this.checkPortInUse(port);

            if (!isPortInUse) {
                break;  // Se a porta não estiver em uso, saia do loop
            }

            console.log(`\n\nA porta ${port} já está em uso. Tentando outra porta...`);
            port += 30;  // Tente a próxima porta (adicionando 30)
            attempt++;
        }

        if (attempt === maxAttempts) {
            console.log("\n\nTodas as portas tentadas estão em uso. Não foi possível iniciar o servidor.");
            return;
        }

        try {
            this.app.listen(port, () => {
                console.log(`\n\nServidor Whatsapp iniciado na porta ${port}`);

                this.checkServerStatus();
            });
        } catch (error) {
            console.log('\n\nFalha ao conectar o servidor', error);
        }
    }

}

module.exports = BackendController;


function main_Backend() {
    const backend = new BackendController();
    backend.start_backend();
}

//main_Backend()