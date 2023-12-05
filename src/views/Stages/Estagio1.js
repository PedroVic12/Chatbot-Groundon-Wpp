const StagesView = require('../StagesView');

class Stage1 extends StagesView {
	constructor(whatsapp) {
		super(whatsapp);
	}

	async execute(message) {
		console.log('\nEstágio 1:', message.body);

		await this.delay(1000).then(
			this.enviarMensagem(message, `Bem-vindo a Lanchonete *Citta RJ* Obrigado por escolher a nossos Serviços.\n🤖 Eu sou o Robô Groundon e estou aqui para ajudá-lo.`)
		);

		this.pushStage(2).then(
			await this.delay(3000).then(
				this.enviarMensagem(message, "🤖 Antes de começarmos, por favor, *Digite Seu Nome*:")
			)
		);
	}
}

module.exports = Stage1;
