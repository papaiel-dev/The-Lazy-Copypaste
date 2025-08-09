const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
const saltRounds = 10;
const JWT_SECRET = 'seu-segredo-super-secreto-e-longo-para-garantir-seguranca';

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- Conexão com o Banco de Dados ---
const db = new sqlite3.Database('./feedbacks.db', (err) => {
    if (err) return console.error("Erro ao conectar ao banco de dados:", err.message);
    console.log('Conectado ao banco de dados SQLite.');
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL)');
        db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(id)
        )`);
    });
});

// --- Middleware de Autenticação ---
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Acesso não autorizado. Por favor, faça login.' });
        }
        return res.redirect('/');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Sessão inválida ou expirada. Por favor, faça login novamente.' });
        }
        return res.redirect('/');
    }
};

// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    try {
        const password_hash = await bcrypt.hash(password, saltRounds);
        const sql = 'INSERT INTO users (email, password_hash) VALUES (?, ?)';
        db.run(sql, [email, password_hash], function(err) {
            if (err) return res.status(409).json({ error: 'Este e-mail já está em uso.' });
            res.status(201).json({ message: 'Usuário criado com sucesso!', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Erro interno do servidor.' });
        if (!user) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
        res.json({ message: 'Login bem-sucedido!' });
    });
});

app.post('/api/users/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout bem-sucedido.' });
});

app.get('/api/users/me', authMiddleware, (req, res) => {
    res.json(req.user);
});


// --- ROTAS DA API DE FEEDBACKS (Protegidas) ---
app.get('/api/feedbacks', authMiddleware, (req, res) => {
    const { search, limit } = req.query;
    let sql = "SELECT * FROM feedbacks WHERE userId = ?";
    const params = [req.user.id];
    if (search) {
        sql += " AND (title LIKE ? OR text LIKE ?)";
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

app.get('/api/feedbacks/:id', authMiddleware, (req, res) => {
    const sql = "SELECT * FROM feedbacks WHERE id = ? AND userId = ?";
    db.get(sql, [req.params.id, req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Feedback não encontrado ou não pertence a você." });
        res.json(row);
    });
});

app.post('/api/feedbacks', authMiddleware, (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) return res.status(400).json({ error: 'Título e texto são obrigatórios.' });
    const checkSql = 'SELECT id FROM feedbacks WHERE title = ? AND userId = ?';
    db.get(checkSql, [title, req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar o título.' });
        if (row) return res.status(409).json({ error: 'Você já possui um feedback com este título.' });
        const insertSql = 'INSERT INTO feedbacks (title, text, userId) VALUES (?, ?, ?)';
        db.run(insertSql, [title, text, req.user.id], function(err) {
            if (err) return res.status(500).json({ error: 'Erro ao salvar o novo feedback.' });
            res.status(201).json({ id: this.lastID, title, text });
        });
    });
});

app.put('/api/feedbacks/:id', authMiddleware, (req, res) => {
    const { title, text } = req.body;
    const feedbackId = req.params.id;
    if (!title || !text) return res.status(400).json({ error: 'Título e texto são obrigatórios.' });
    const checkSql = 'SELECT id FROM feedbacks WHERE title = ? AND id != ? AND userId = ?';
    db.get(checkSql, [title, feedbackId, req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar o título.' });
        if (row) return res.status(409).json({ error: 'Outro feedback seu já utiliza este título.' });
        const updateSql = 'UPDATE feedbacks SET title = ?, text = ? WHERE id = ? AND userId = ?';
        db.run(updateSql, [title, text, feedbackId, req.user.id], function(err) {
            if (err) return res.status(500).json({ error: 'Erro ao atualizar o feedback.' });
            if (this.changes === 0) return res.status(404).json({ error: 'Feedback não encontrado ou não pertence a você.' });
            res.json({ message: 'Feedback atualizado com sucesso' });
        });
    });
});

app.delete('/api/feedbacks/:id', authMiddleware, (req, res) => {
    const sql = 'DELETE FROM feedbacks WHERE id = ? AND userId = ?';
    db.run(sql, [req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Feedback não encontrado ou não pertence a você.' });
        res.json({ message: 'Feedback excluído com sucesso' });
    });
});


// --- ROTAS PARA SERVIR AS PÁGINAS HTML ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/manage.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'manage.html')));
app.get('/search.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/edit', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));
app.get('/edit/:id', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));

// --- Inicia o servidor ---
app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));