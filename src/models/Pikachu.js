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
                    key: this.apiKey // Utilizar a chave da API aqui
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


function main_pikachu() {
    // Exemplo de uso:
    const apiKey = 'AIzaSyBz5PufcmSRVrrmTWPHS2qlzPosL70XrwE'; // Substitua pela sua chave da API
    const pikachu = new Pikachu(apiKey);

    pikachu.calcularTrajeto('Copacabana, Rio de Janeiro', 'Botafogo, Rio de Janeiro')
        .then((info) => {
            console.log('\n\nInformações de trajeto:');
            console.log('Distância:', info.distancia);
            console.log('Duração:', info.duracao);
        })
        .catch((error) => {
            console.error(error.message);
        });



    pikachu.obterCEP("Copacabana, Rio de Janeiro")
        .then((cep) => {
            console.log("\n\nEndereço com CEP:", cep);
        })
        .catch((error) => {
            console.error(error.message);
        });



    pikachu.obterTempoEstimadoDeEntrega("Copacabana, Rio de Janeiro", "Botafogo, Rio de Janeiro")
        .then((eta) => {
            console.log("\n\nTEMPO ESTIMADO DE ENTREGA:");
            console.log("Distância:", eta.distancia);
            console.log("Duração:", eta.duracao);
        })
        .catch((error) => {
            console.error(error.message);
        });




    let endereço = 'Copacabana, Rio de Janeiro'
    pikachu.obterInformacoesDeLocalizacao(endereço)
        .then((localizacao) => {
            console.log(`\n\nInformações de localização: ${endereço} `);
            console.log('Latitude:', localizacao.latitude);
            console.log('Longitude:', localizacao.longitude);
        })
        .catch((error) => {
            console.error(error.message);
        });

}


main_pikachu()