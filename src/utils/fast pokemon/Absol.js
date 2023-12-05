const fs = require('fs');
const { create } = require('@wppconnect-team/wppconnect');

const SESSION_FILE_PATH = './session.json';

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

create({
    session: 'my-session',
    catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
        console.log(asciiQR); // Generate QR in terminal
    },
    statusFind: (statusSession, session) => {
        console.log('Status Session: ', statusSession);
        if (statusSession === 'isLogged') {
            fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    },
    headless: true,
    devtools: false,
    useChrome: true,
    debug: false,
    logQR: true,
    browserArgs: ['--log-level=3', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu'],
    disableWelcome: true,
    updatesLog: true,
    autoClose: 60000,
    token: sessionData,
})
    .then((client) => start(client))
    .catch((error) => console.log(error));

function start(client) {
    client.onMessage((message) => {
        console.log('Received message:', message.body);
    });
}
