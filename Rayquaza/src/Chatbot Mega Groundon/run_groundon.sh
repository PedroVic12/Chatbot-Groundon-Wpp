#!/bin/bash

APP_NAME="Chatbot-Groundon"
INDEX_PATH="/home/pedrov/Documentos/GitHub/Chatbot-Groundon-Wpp/Rayquaza/src/Chatbot Mega Groundon/index.js"

# Verifica se a aplicação está rodando
IS_RUNNING=$(pm2 describe $APP_NAME 2>/dev/null | grep "online")

if [ -z "$IS_RUNNING" ]; then
    echo -e "Iniciando a aplicação $APP_NAME...\n"
    
    # Inicia a aplicação com o caminho completo para o arquivo index.js
    pm2 start index.js --name $APP_NAME
    
    # Salva a aplicação para reiniciar automaticamente após reboots do sistema
    pm2 save
else
    # Se estiver rodando, reinicia a aplicação
    echo -e "\nReiniciando a aplicação $APP_NAME...\n"
    pm2 restart $APP_NAME
fi

# Limpa o console e mostra os logs
clear
pm2 logs $APP_NAME
