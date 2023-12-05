class Groundon {
	constructor() {
		this.numero_estagio = 1;
		this.conversa = [[], [], [], [], [], [], [], [], [], []];
		this.numero_pedido_dia = 1;
		this.whatsapp = null;
	}

	armazenarConversa(message) {
		if (message.body.length < 1000) {
			this.conversa[this.numero_estagio - 1].push(message.body);
		}
	}


	// Método auxiliar para adicionar atraso (em milissegundos)
	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Método para armazenar uma mensagem na conversa atual
	armazenarConversa(message) {
		if (message.body.length < 1000) {
			this.conversa[this.numero_estagio - 1].push(message.body);
		}
	}

	// Método para salvar a conversa em um arquivo CSV
	salvarConversaCSV() {
		// Nome do arquivo CSV
		const csvFileName = 'conversa_groundon.csv';

		// Crie um escritor CSV
		const csvWriter = createCsvWriter({
			path: csvFileName,
			header: [
				{ id: 'estagio', title: 'Estagio' },
				{ id: 'mensagens', title: 'Mensagens' },
			],
		});

		// Preparar os dados para escrita no CSV
		const csvData = [];
		for (let i = 0; i < this.conversa.length; i++) {
			if (this.conversa[i].length > 0) {
				const conversa = this.conversa[i].join('\n');
				csvData.push({ estagio: i + 1, mensagens: conversa });
			}
		}

		// Escrever os dados no arquivo CSV
		csvWriter.writeRecords(csvData)
			.then(() => {
				console.log('Conversa salva em', csvFileName);
			})
			.catch((error) => {
				console.error('Erro ao salvar conversa:', error);
			});
	}


	getStage() {
		const currentStage = this.conversa[this.numero_estagio - 1];
		if (currentStage.length > 0) {
			return currentStage[currentStage.length - 1];
		}
		return null;
	}

	avancarEstagio() {
		this.numero_estagio++;
	}


	// Funções de interação com o cliente

	coutText(text) {
		console.log('===================')
		console.log(text)
		console.log('===================')

	}

	// Outros métodos relacionados à lógica de negócios do Groundon
}
module.exports = Groundon;