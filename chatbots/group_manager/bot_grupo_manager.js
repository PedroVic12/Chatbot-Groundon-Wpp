const wppconnect = require('@wppconnect-team/wppconnect');

class GroupManager {
    constructor(wpp) {
        this.WPP = wpp;
        this.adminPhone = '552199289987@c.us'; // Seu número de telefone para controle (inclua o sufixo @c.us)
    }

    async groupExists(groupName) {
        try {
            // Obtém todos os grupos
            const groups = await this.WPP.group.list();

            // Verifica se algum grupo possui o nome desejado
            return groups.some(group => group.name === groupName);
        } catch (error) {
            console.error(`Erro ao verificar a existência do grupo: ${error.message}`);
            return false;
        }
    }

    async createGroup(groupName, participants, parentGroup) {
        try {
            // Verifica se o grupo já existe
            if (await this.groupExists(groupName)) {
                console.log(`O grupo "${groupName}" já existe.`);
                return;
            }

            // Criação do grupo
            const result = await this.WPP.createGroup(groupName, participants, parentGroup);

            console.log('\nGrupo criado com sucesso"');
            console.log(`ID do grupo: ${result.gid.toString()}`);

            // Informações dos participantes
            for (const [phone, participantInfo] of Object.entries(result.participants)) {
                console.log(`\nParticipante ${phone}:`);
                //console.log(`Código: ${participantInfo.code}`);
                console.log(`Código de convite: ${participantInfo.invite_code}`);
                console.log(`Código de convite expiração: ${participantInfo.invite_code_exp}`);
                console.log(`ID: ${participantInfo.wid}`);
            }

            return result;
        } catch (error) {
            console.error(`Erro ao criar grupo: ${error.message}`);
        }
    }

    async setPermissions(groupId) {
        try {
            // Promove o seu número para admin
            await this.WPP.group.promoteParticipant(groupId, this.adminPhone);

            // Demote todos os outros participantes para que apenas admins possam enviar mensagens
            const groupInfo = await this.WPP.group.getGroupInfo(groupId);
            for (const participant of groupInfo.participants) {
                if (participant.id !== this.adminPhone) {
                    await this.WPP.group.demoteParticipant(groupId, participant.id);
                }
            }

            // Configura o grupo para que apenas admins possam enviar mensagens
            await this.WPP.group.setGroupSettings(groupId, {
                sendMessages: 'admins' // Apenas admins podem enviar mensagens
            });

            console.log(`Permissões configuradas para o grupo ${groupId}. Somente admins podem enviar mensagens.`);
        } catch (error) {
            console.error(`Erro ao configurar permissões: ${error.message}`);
        }
    }
}

// Exemplo de uso
(async () => {
    try {
        const client = await wppconnect.create({
            tokenStore: 'file',
            folderNameToken: 'tokens',
            session: 'grupo_manager' // Nome da sessão
        });
        if (client) {
            console.log('\nConectado ao WhatsApp com sucesso! :) \n');
            resolve(true);
        } else {
            console.log(`Debug ${client}`);
            reject(new Error("WhatsApp connection failed."));
        }
        const groupManager = new GroupManager(client);

        // Criar grupo com participantes
        const participants = ['552199289987@c.us', '5521997091499@c.us'];
        const groupResult = await groupManager.createGroup('Test Group', '552199289987@c.us');
        
        if (groupResult) {
            // Extrair informações do grupo
            const groupId = groupResult.gid.toString();
            const inviteCode = Object.values(groupResult.participants)[0].invite_code;

            console.log(`Código do convite: ${inviteCode}`);

            // Enviar link de convite
            const inviteLink = 'https://chat.whatsapp.com/' + inviteCode;
            console.log(`Link de convite: ${inviteLink}`);

            // Configurar permissões
            await groupManager.setPermissions(groupId);
        }
    } catch (error) {
        console.error('Erro ao executar o script:', error);
    }
})();
