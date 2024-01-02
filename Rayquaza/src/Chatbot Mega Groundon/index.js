const GroundonController = require('./src/controllers/GroundonController');
const BackendController = require('./src/controllers/BackendController');
const StagesView = require('./src/views/StagesView');



//! TEMPO DE CONEXÃO COM O WPP = 20 SEGUNDOS, depois disso rodar o servidor Rayquaza


//?npm install venom-bot@5.0.7      
//? venom-bot/dist/controllers/browser.js -> na funcao launchOptions -> comentar o parâmetro headless:options.headless

async function initializeWhatsApp(groundonController) {
	try {
		await groundonController.conectarWpp();
		console.log('\nWhatsapp conectado');
		return true;
	} catch (error) {
		console.log('\n\nErro ao tentar conectar', error);
		return false;
	}
}

async function initializeBackend(backendController) {
	try {
		await backendController.start_backend();
		console.log('\nBackend inicializado');
	} catch (error) {
		console.log('\n\nErro ao iniciar o backend', error);
	}
}









async function startStagesView(groundonController, backendController) {
	const stagesView = new StagesView(
		groundonController.whatsapp,
		groundonController,
		backendController
	);

	try {
		await stagesView.start_chatbot_Groundon();
		await groundonController.delay(3000).then(
			console.log('\nChatbot Groundon iniciado')
		);
		return true;
	} catch (error) {
		console.error('\n\nOcorreu um erro ao iniciar o Chatbot Groundon:', error);
		return false;
	}




}

async function MAIN_ROBO_GROUNDON() {
	const groundonController = new GroundonController();
	const backendController = new BackendController();

	const isWhatsAppConnected = await initializeWhatsApp(groundonController);
	if (isWhatsAppConnected) {
		await initializeBackend(backendController);
	} else {
		console.log('\n\nNão foi possível iniciar o backend, pois o WhatsApp não está conectado.');
		return;
	}

	


	const groundonIsOnline = await startStagesView(groundonController, backendController);

	await groundonController.delay(8000).then(
		console.log('Conectando...')
	)

	if (groundonIsOnline) {
		console.log('\n\n\n==================================================')
		console.log('Chatbot Groundon está online. :)', groundonIsOnline);
		console.log('==================================================\n')
	}
}

MAIN_ROBO_GROUNDON().catch((error) => {
	console.error('\n\nOcorreu um erro:', error);
});
