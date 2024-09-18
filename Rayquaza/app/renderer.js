const { ipcRenderer } = require('electron');

// Definindo os scripts que você deseja rodar
const scripts = [
  { id: 'chatbotWpp', name: 'Chatbot MultiModal WPP', path: '/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/chatbots/src/agendamento_google/', command: 'node run_bot_agendamento.js' },
  { id: 'wppServidor', name: 'WPP Servidor', path: '/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/chatbots/wppconnect-server/', command: 'npm start' },
  // Você pode adicionar mais scripts aqui
];

scripts.forEach(script => {
  const button = document.getElementById(script.id);
  
  button.addEventListener('click', () => {
    // Envia a solicitação para o processo principal para iniciar o terminal
    ipcRenderer.send('create-terminal', script);
    button.textContent = `Rodando ${script.name}...`;
    button.disabled = true;  // Desabilita o botão enquanto o script está rodando
  });
});
