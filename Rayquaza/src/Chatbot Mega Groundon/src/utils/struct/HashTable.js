const fs = require('fs');

class Hashtable {
    constructor() {
        this.table = {};
    }

    insert(key, value) {
        this.table[key] = value;
    }

    get(key) {
        return this.table[key];
    }

    remove(key) {
        delete this.table[key];
    }

    isEmpty() {
        return Object.keys(this.table).length === 0;
    }

    size() {
        return Object.keys(this.table).length;
    }

    keys() {
        return Object.keys(this.table);
    }

    values() {
        return Object.values(this.table);
    }
}

// Ler o arquivo JSON
const data = fs.readFileSync('cardapio.json', 'utf8');

// Converter o JSON para um objeto JavaScript
const cardapio = JSON.parse(data);

// Criar uma instância da hashtable
const hashtable = new Hashtable();

// Percorrer os itens do cardápio e inserir na hashtable
cardapio.forEach(item => {
    const nome = item['Sanduíches Tradicionais'];
    const ingredientes = item['Igredientes'];
    const preco = item['Preço.4'];

    hashtable.insert(nome, { ingredientes, preco });
});

// Exemplo de uso da hashtable
console.log('Tamanho da hashtable:', hashtable.size());
console.log('Chaves da hashtable:', hashtable.keys());
console.log('Valores da hashtable:', hashtable.values());

// Obter informações de um sanduíche específico
const sanduiche = 'Bauru';
const info = hashtable.get(sanduiche);

if (info) {
    console.log(`Informações do sanduíche "${sanduiche}":`, info);
} else {
    console.log(`O sanduíche "${sanduiche}" não foi encontrado na hashtable.`);
}
