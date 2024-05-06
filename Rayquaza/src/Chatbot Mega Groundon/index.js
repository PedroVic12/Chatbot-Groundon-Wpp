const GroundonController = require('./src/controllers/GroundonController');
const BackendController = require('./src/controllers/BackendController');
const StagesView = require('./src/views/StagesView');
const GenaiAssistente = require("./src/models/IA Models/Genai/genai_cardapio")


//novo numero groundon -> 988377364


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
	const MODEL_NAME = "gemini-1.5-pro-latest";
	const API_KEY = "AIzaSyDaVlWCey5Z_X3r6l4Kjo3Keo6kTK6S_XY";
	const model = new GenaiAssistente(API_KEY, MODEL_NAME)

	const stagesView = new StagesView(
		groundonController.whatsapp,
		groundonController,
		backendController,
		model
	);

	try {
		await stagesView.start_chatbot_Groundon();
		await groundonController.delay(3000).then(
			console.log('\nChatbot Groundon iniciado no zap zap')
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
