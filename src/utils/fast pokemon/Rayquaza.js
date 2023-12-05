const venom = require('venom-bot');

class RayquazaController {
    constructor() {
        this.client = {};
        venom
            .create(
                {
                    session: 'rayquaza' //name of session
                }
            )
            .then((client) => this.initializeClient(client))
            .catch((error) => console.log(error));
        this.clientStates = {}; // Store client states
    }

    async initializeClient(client) {
        this.client = client;
        this.client.onMessage((message) => this.handleMessage(message));
    }

    getClientState(clientId) {
        if (!this.clientStates[clientId]) {
            this.clientStates[clientId] = {
                stage: 'stage1',
                timer: null
            };
        }
        return this.clientStates[clientId];
    }

    setClientState(clientId, newState) {
        const state = this.getClientState(clientId);
        state.stage = newState;

        // Cancel the existing timer if there is one
        if (state.timer) {
            clearTimeout(state.timer);
        }

        const tempo_conversa = 1 * 60 * 1000

        // Start a new timer to reset the state after 1 minute
        state.timer = setTimeout(() => {
            state.stage = 'stage1';
            console.log(`Resetting stage for client ${clientId}`);
        }, tempo_conversa);
    }

    async handleMessage(message) {
        const clientId = message.from;  // Using the sender's number as the client ID
        const state = this.getClientState(clientId);

        // Check if the message is "!resetar"
        if (message.body.toLowerCase() === '!resetar') {
            console.log(`Reset command received from ${clientId}. Resetting to stage 1.`);
            this.setClientState(clientId, 'stage1');
            await this.stage1(message);
            return;
        }

        switch (state.stage) {
            case 'stage1':
                await this.stage1(message);
                this.setClientState(clientId, 'stage2');
                break;
            case 'stage2':
                await this.stage2(message);
                this.setClientState(clientId, 'stage3');
                break;
            // ... other stages ...
        }

        // Reset the timer for this client since we received a message
        this.setClientState(clientId, state.stage);
    }


    // Original methods from the file you provided
    async stage1(message) {
        await this.client.sendText(message.from, '🤖: Ola, tudo bem?');
    }

    async stage2(message) {
        await this.client.sendText(message.from, '🤖: Como posso ajudar?');
    }

    async stage3(message) {
        await this.client.sendText(message.from, '🤖: Terceira mensagem');
    }
}

module.exports = RayquazaController;


function main_rayquaza() {
    const rayquazaBot = new RayquazaController();
    console.log("Rayquaza bot is now running...");
}

main_rayquaza(); 