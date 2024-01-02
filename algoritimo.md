# Algorítimo

## Levantamento de Requisitos

- NodeJS para conectar com o WPP, receber mensagens, enviar mensagens com lista e botoes
- NodeJS salva os pedidos num arquivo csv ou json

## Conectar 3 Tecnologias diferentes

Para conectar todas as tecnologias (servidor web em Python, chatbot em Node.js e frontend em Flutter), você pode seguir a arquitetura cliente-servidor. :

### Frontend em Flutter

O frontend em Flutter é responsável por fornecer a interface do usuário e interagir com os usuários.
Ele pode enviar solicitações HTTP para o servidor web em Python para buscar ou enviar dados.
Servidor web em Python:

### O servidor web em Python

Usando o FastAPI ou outro framework, é responsável por lidar com as solicitações do cliente (frontend) e fornecer respostas adequadas.

Ele pode atuar como intermediário entre o frontend e o chatbot em Node.js.
Quando recebe uma solicitação do frontend, o servidor pode processar os dados necessários, chamar o chatbot para realizar operações adicionais, se necessário, e retornar as respostas para o frontend.
Chatbot em Node.js:

### O chatbot em Node.js

responsável por processar as solicitações do servidor web e fornecer respostas adequadas.
Ele pode receber as solicitações do servidor web, processá-las usando a lógica do chatbot e retornar as respostas para o servidor web.

#### Aqui está um exemplo simplificado de como essas partes podem se comunicar

- O frontend em Flutter faz uma solicitação HTTP para o servidor web em Python, enviando os dados necessários.
- O servidor web em Python recebe a solicitação e, se necessário, chama o chatbot em Node.js, passando os dados relevantes.
- O chatbot em Node.js processa a solicitação e retorna uma resposta ao servidor web.
- O servidor web em Python recebe a resposta do chatbot e retorna uma resposta ao frontend em Flutter.
- O frontend em Flutter exibe a resposta para o usuário.
