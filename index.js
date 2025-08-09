require('dotenv').config();

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-local-super-secreto';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            );
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS feedbacks (
                id SERIAL PRIMARY KEY,
                userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                text TEXT NOT NULL,
                createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await client.query('ALTER TABLE feedbacks ADD CONSTRAINT unique_user_title UNIQUE (userId, title);').catch(e => {
            if (e.code !== '42710') throw e;
        });
        console.log('Tabelas do PostgreSQL verificadas/criadas com sucesso.');
    } catch (err) {
        console.error('Erro ao criar tabelas:', err);
    } finally {
        client.release();
    }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Acesso não autorizado.' });
        return res.redirect('/');
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Sessão inválida.' });
        return res.redirect('/');
    }
};

app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    try {
        const password_hash = await bcrypt.hash(password, saltRounds);
        const sql = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id';
        const result = await pool.query(sql, [email, password_hash]);
        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: result.rows[0].id });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'Este e-mail já está em uso.' });
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    try {
        const sql = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(sql, [email]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
        res.json({ message: 'Login bem-sucedido!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});
app.post('/api/users/logout', (req, res) => res.clearCookie('token').json({ message: 'Logout bem-sucedido.' }));
app.get('/api/users/me', authMiddleware, (req, res) => res.json(req.user));

app.get('/api/feedbacks', authMiddleware, async (req, res) => {
    try {
        const { search, limit } = req.query;
        let sql = "SELECT * FROM feedbacks WHERE userId = $1";
        const params = [req.user.id];
        let paramIndex = 2;
        if (search) {
            sql += ` AND (title ILIKE $${paramIndex++} OR text ILIKE $${paramIndex++})`; // ILIKE é case-insensitive
            params.push(`%${search}%`, `%${search}%`);
        }
        sql += ` ORDER BY title ASC`;
        if (limit) {
            sql += ` LIMIT $${paramIndex++}`;
            params.push(parseInt(limit, 10));
        }
        const result = await pool.query(sql, params);
        res.json({ feedbacks: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar feedbacks.' });
    }
});
app.get('/api/feedbacks/:id', authMiddleware, async (req, res) => {
    try {
        const sql = "SELECT * FROM feedbacks WHERE id = $1 AND userId = $2";
        const result = await pool.query(sql, [req.params.id, req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Feedback não encontrado." });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar feedback.' });
    }
});
app.post('/api/feedbacks', authMiddleware, async (req, res) => {
    try {
        const { title, text } = req.body;
        if (!title || !text) return res.status(400).json({ error: 'Título e texto são obrigatórios.' });
        const sql = 'INSERT INTO feedbacks (title, text, userId) VALUES ($1, $2, $3) RETURNING id';
        const result = await pool.query(sql, [title, text, req.user.id]);
        res.status(201).json({ id: result.rows[0].id, title, text });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'Você já possui um feedback com este título.' });
        res.status(500).json({ error: 'Erro ao salvar o feedback.' });
    }
});
app.put('/api/feedbacks/:id', authMiddleware, async (req, res) => {
    try {
        const { title, text } = req.body;
        if (!title || !text) return res.status(400).json({ error: 'Título e texto são obrigatórios.' });
        const sql = 'UPDATE feedbacks SET title = $1, text = $2 WHERE id = $3 AND userId = $4';
        const result = await pool.query(sql, [title, text, req.params.id, req.user.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Feedback não encontrado.' });
        res.json({ message: 'Feedback atualizado com sucesso' });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'Outro feedback seu já utiliza este título.' });
        res.status(500).json({ error: 'Erro ao atualizar o feedback.' });
    }
});
app.delete('/api/feedbacks/:id', authMiddleware, async (req, res) => {
    try {
        const sql = 'DELETE FROM feedbacks WHERE id = $1 AND userId = $2';
        const result = await pool.query(sql, [req.params.id, req.user.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Feedback não encontrado.' });
        res.json({ message: 'Feedback excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir o feedback.' });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/manage.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'manage.html')));
app.get('/search.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/edit', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));
app.get('/edit/:id', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));

app.listen(port, () => {
    createTables();
    console.log(`Servidor rodando na porta ${port}`);
});