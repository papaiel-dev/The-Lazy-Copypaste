const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middlewares para entender JSON e servir arquivos estáticos da pasta 'public'
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados
const db = new sqlite3.Database('./feedbacks.db', (err) => {
    if (err) {
        return console.error("Erro ao conectar ao banco de dados:", err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
    // Cria a tabela com a coluna "title" se ela não existir
    db.run('CREATE TABLE IF NOT EXISTS feedbacks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, text TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)');
});

// --- ROTAS DA API ---

// GET: Listar todos os feedbacks (com busca e ordenação alfabética)
app.get('/api/feedbacks', (req, res) => {
    const { search, limit } = req.query;
    let sql = "SELECT * FROM feedbacks";
    const params = [];

    if (search) {
        sql += " WHERE title LIKE ? OR text LIKE ?";
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY title ASC"; 

    if (limit) {
        sql += " LIMIT ?";
        params.push(parseInt(limit, 10));
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ feedbacks: rows });
    });
});

// GET: Obter um feedback específico pelo ID
app.get('/api/feedbacks/:id', (req, res) => {
    const sql = "SELECT * FROM feedbacks WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Feedback não encontrado" });
        res.json(row);
    });
});

// POST: Criar um novo feedback
app.post('/api/feedbacks', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) return res.status(400).json({ error: 'Título e texto são obrigatórios.' });
    const sql = 'INSERT INTO feedbacks (title, text) VALUES (?, ?)';
    db.run(sql, [title, text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, text });
    });
});

// PUT: Atualizar um feedback existente
app.put('/api/feedbacks/:id', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) return res.status(400).json({ error: 'Título e texto são obrigatórios.' });
    const sql = 'UPDATE feedbacks SET title = ?, text = ? WHERE id = ?';
    db.run(sql, [title, text, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Feedback não encontrado.' });
        res.json({ message: 'Feedback atualizado com sucesso' });
    });
});

// DELETE: Excluir um feedback
app.delete('/api/feedbacks/:id', (req, res) => {
    const sql = 'DELETE FROM feedbacks WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Feedback não encontrado.' });
        res.json({ message: 'Feedback excluído com sucesso' });
    });
});


// --- ROTAS PARA SERVIR AS PÁGINAS HTML ---

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/search.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/manage.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'manage.html')));
app.get('/edit', (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));
app.get('/edit/:id', (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));


// --- Inicia o servidor ---
app.listen(port, () => {
    console.log(`Servidor rodando. Acesse a página inicial em http://localhost:${port}`);
});