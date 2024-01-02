const { Client } = require("@googlemaps/google-maps-services-js");

class Pikachu {
    constructor(apiKey) {
        this.client = new Client({});
        this.apiKey = apiKey; // Armazenar a chave da API para uso posterior
    }

    async calcularTrajeto(origem, destino, modo = 'driving') {
        try {
            const response = await this.client.directions({
                params: {
                    origin: origem,
                    destination: destino,
                    mode: modo,
                    key: this.apiKey
                },
            });

            const rota = response.data.routes[0];
            return {
                distancia: rota.legs[0].distance.text,
                duracao: rota.legs[0].duration.text,
            };
        } catch (error) {
            throw new Error('Erro ao calcular o trajeto: ' + error.message);
        }
    }

    async obterTempoEstimadoDeEntrega(origem, destino) {
        try {
            const response = await this.client.directions({
                params: {
                    origin: origem,
                    destination: destino,
                    mode: "driving",
                    key: this.apiKey,
                },
            });

            // Verifica se a resposta contém rotas
            if (response.data.routes.length > 0) {
                const rota = response.data.routes[0];
                const perna = rota.legs[0];

                // Retorna a distância e a duração da rota
                return {
                    distancia: perna.distance.text,
                    duracao: perna.duration.text,
                };
            } else {
                throw new Error("Rota não encontrada.");
            }
        } catch (error) {
            throw new Error("Erro ao obter ETA: " + error.message);
        }
    }

    async obterCEP(endereco) {
        try {
            const response = await this.client.geocode({
                params: {
                    address: endereco,
                    key: this.apiKey,
                },
            });

            // Verifica se a resposta contém resultados
            if (response.data.results.length > 0) {
                const localizacao = response.data.results[0];

                // Retorna o endereço formatado, que deve incluir o CEP
                return localizacao.formatted_address;
            } else {
                throw new Error("Endereço não encontrado.");
            }
        } catch (error) {
            throw new Error("Erro ao obter o CEP: " + error.message);
        }
    }


    async obterInformacoesDeLocalizacao(endereco) {
        try {
            const response = await this.client.geocode({
                params: {
                    address: endereco,
                    key: this.apiKey // Utilizar a chave da API aqui
                },
            });

            const resultados = response.data.results;
            if (resultados.length > 0) {
                const localizacao = resultados[0].geometry.location;
                return {
                    latitude: localizacao.lat,
                    longitude: localizacao.lng,
                };
            } else {
                throw new Error('Endereço não encontrado.');
            }
        } catch (error) {
            throw new Error('Erro ao obter informações de localização: ' + error.message);
        }
    }
}

module.exports = Pikachu;

async function main_pikachu() {
    const apiKey = 'AIzaSyBz5PufcmSRVrrmTWPHS2qlzPosL70XrwE';
    const pikachu = new Pikachu(apiKey);

    let lojasEndereco = ['Castelo, Rio de Janeiro', 'Copacabana', 'Botafogo, Rio de Janeiro', 'Ipanema'];
    let enderecoDesejado = 'Centro, Rio de Janeiro';

    let menorDistancia = Number.MAX_SAFE_INTEGER;
    let lojaMaisProxima = '';

    for (const loja of lojasEndereco) {
        try {
            const info = await pikachu.calcularTrajeto(loja, enderecoDesejado).then((info) => {
                console.log(`\nInformações de trajeto: ${loja} X ${enderecoDesejado}`);
                if (info.distancia >= `15.0 km`) {
                    console.log("VOCE ESTA LONGE AREA DE ENTREGA! ")
                }
                else {
                    console.log('Distância:', info.distancia);
                    console.log('Duração:', info.duracao);
                }

                let distanciaNumerica = parseFloat(info.distancia.split(' ')[0]);
                if (distanciaNumerica < menorDistancia) {
                    menorDistancia = distanciaNumerica;
                    lojaMaisProxima = loja;
                }

            })


        }

        catch (error) {
            console.error('Erro ao calcular distância para a loja ' + loja + ': ' + error.message);
        }

        // Imprime a resposta final fora do loop
    }
    console.log('\n\nLoja mais próxima ---> ' + lojaMaisProxima, 'Distância: ' + menorDistancia + ' km');

}

main_pikachu()
