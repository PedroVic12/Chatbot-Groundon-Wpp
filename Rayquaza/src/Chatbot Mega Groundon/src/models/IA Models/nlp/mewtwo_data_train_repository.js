class mewtwoRepository {
    constructor() {

    }



    async getIntentsAndResponses() {
        return {
            intents: {
                saudacao: ['boa noite', 'boa tarde', 'bom dia', 'alo', 'olá', 'oi', 'hello'],

                despedida: ['obrigado e tchau', 'te vejo mais tarde',],

                pedido: ["cardapio", "promoção hoje", 'fazer pedido', 'quero ver o menu', 'me mostre o cardapio', 'gostaria de pedir a promoção', 'fazer um pedido', 'fazer um pedido de delivery', 'fazer um delivery', 'entregar comida', 'quero uma pizza', 'quero um hambúrguer'],

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
}

module.exports = mewtwoRepository;