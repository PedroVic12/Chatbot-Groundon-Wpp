
const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
    .create({
        session: 'charizard',
        tokenStore: 'file',
        folderNameToken: 'tokens'
    })
    .then((cliente) => start(cliente))
    .catch((error) => console.log(error));

function start(cliente) {
    cliente.onMessage((message) => {
        if (message.body = 'Hello') {
            cliente
                .sendText(message.from, 'Welcome Homem Aranha 🕷')
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                })
        }
    })
}
