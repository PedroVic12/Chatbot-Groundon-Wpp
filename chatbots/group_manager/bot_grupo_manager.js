class ContactManager {
    constructor() {
        // Assumindo que o WPPConnect está configurado globalmente
    }

    async addContact(name, phone) {
        try {
            // Adiciona o contato (ou apenas armazena informações se a API não suportar adicionar contatos diretamente)
            await WPP.contact.addContact(name, phone);
            console.log(`Contato ${name} adicionado com sucesso.`);
        } catch (error) {
            console.error(`Erro ao adicionar contato: ${error.message}`);
        }
    }

    async getContact(phone) {
        try {
            const contact = await WPP.contact.getContact(phone);
            return contact;
        } catch (error) {
            console.error(`Erro ao obter contato: ${error.message}`);
        }
    }
}

class GroupManager {
    constructor() {
        // Assumindo que o WPPConnect está configurado globalmente
        this.adminPhone = '1234567890'; // Seu número de telefone para controle
    }

    async createGroup(groupName) {
        try {
            const group = await WPP.group.createGroup(groupName);
            console.log(`Grupo ${groupName} criado com sucesso.`);
            return group;
        } catch (error) {
            console.error(`Erro ao criar grupo: ${error.message}`);
        }
    }

    async addParticipant(groupId, phone) {
        try {
            await WPP.group.addParticipant(groupId, phone);
            console.log(`Participante ${phone} adicionado ao grupo ${groupId}.`);
        } catch (error) {
            console.error(`Erro ao adicionar participante: ${error.message}`);
        }
    }

    async setPermissions(groupId) {
        try {
            // Promove o seu número para admin
            await WPP.group.promoteParticipant(groupId, this.adminPhone);

            // Demote todos os outros participantes para que apenas admins possam enviar mensagens
            const participants = await WPP.group.getGroupInfo(groupId);
            for (const participant of participants) {
                if (participant.phone !== this.adminPhone) {
                    await WPP.group.demoteParticipant(groupId, participant.phone);
                }
            }

            console.log(`Permissões configuradas para o grupo ${groupId}. Somente admins podem enviar mensagens.`);
        } catch (error) {
            console.error(`Erro ao configurar permissões: ${error.message}`);
        }
    }
}

// Exemplo de uso
(async () => {
    const contactManager = new ContactManager();
    const groupManager = new GroupManager();

    // 1. Adicionar contato
    await contactManager.addContact('John Doe', '9876543210');

    // 2. Criar grupo
    const group = await groupManager.createGroup('My Group');

    // 3. Adicionar participante ao grupo
    await groupManager.addParticipant(group.id, '9876543210');

    // 4. Configurar permissões no grupo
    await groupManager.setPermissions(group.id);
})();
