// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create({
    session: 'session-name' //name of session
  })
  .then((client) => {
    start(client);
    monitorSessionState(client);
  })
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {


  try {

    client.onMessage((message) => {
      console.log('Mensagem recebida:', message.body);

      console.log('\nIniciando...')

      if (message.body === 'Hi' && message.isGroupMsg === false) {
        client
          .sendText(message.from, 'Welcome Homem Aranha 🕷')
          .then((result) => {
            console.log('Result: ', result); //return object success
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });
      }
    });
  } catch (error) {
    console.log('Evento on message nao esta disponivel')
  }

}



function monitorSessionState(client) {
  client.onStateChange((state) => {
    console.log('State changed: ', state);

    // Force it to keep the current session
    if (state === 'CONFLICT' || state === 'UNLAUNCHED') {
      client.forceRefocus();
    }

    // If session is disconnected, try to reconnect
    if (state === 'DISCONNECTED') {
      console.log('Session is disconnected. Trying to reconnect...');
      client.restartService();
    }
  });
}