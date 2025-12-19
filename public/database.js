// Inicializa o Dexie (IndexedDB)
const db = new Dexie("LazyCopyDB");

// Define a estrutura da tabela
db.version(1).stores({
    feedbacks: '++id, title, text, category, created_at'
});

console.log("Banco de dados local inicializado.");