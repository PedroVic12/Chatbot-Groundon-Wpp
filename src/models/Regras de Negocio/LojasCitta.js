// Importe a classe Pikachu aqui
const Pikachu = require('../Pikachu'); // Substitua pelo caminho correto

class LojasCitta {
    constructor() {
        // Inicialize a lista de lojas com seus logradouros
        this.lojas = [
            { nome: 'Loja 1', logradouro: 'Copacabana' },
            { nome: 'Loja 2', logradouro: 'Botafogo' },
            { nome: 'Loja 3', logradouro: 'Ipanema' },
        ];

        // Inicialize a instância de Pikachu com sua chave de API
        this.pikachu = new Pikachu('AIzaSyBz5PufcmSRVrrmTWPHS2qlzPosL70XrwE'); // Substitua pela sua chave de API
    }

    async calcularTrajetosParaCentroDaCidade(destino) {
        const trajetos = [];

        for (const loja of this.lojas) {
            try {
                const trajeto = await this.pikachu.calcularTrajeto(loja.logradouro, destino);
                trajetos.push({ loja: loja.nome, trajeto });
            } catch (error) {
                console.error(`Erro ao calcular trajeto para ${loja.nome}: ${error.message}`);
            }
        }

        return trajetos;
    }
}

// Exemplo de uso:
const lojasCitta = new LojasCitta();

// Calcular trajetos para o centro da cidade
const destino = 'Centro da Cidade, Rio de Janeiro';
lojasCitta.calcularTrajetosParaCentroDaCidade(destino)
    .then((trajetos) => {
        console.log('\n\nTrajetos para o centro da cidade:');
        trajetos.forEach((trajeto) => {
            console.log(`Loja: ${trajeto.loja}`);
            console.log('Distância:', trajeto.trajeto.distancia);
            console.log('Duração:', trajeto.trajeto.duracao);
            console.log('---');
        });
    })
    .catch((error) => {
        console.error(error.message);
    });
