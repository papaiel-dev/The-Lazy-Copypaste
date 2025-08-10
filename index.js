require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- Middleware de Proteção de Página ---
const pageProtectionMiddleware = (req, res, next) => {
    const token = req.cookies['sb-access-token']; // O cookie que o Supabase cria
    if (!token) {
        return res.redirect('/');
    }
    next();
};

// --- Rota de Configuração ---
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.PUBLIC_SUPABASE_ANON_KEY,
    });
});

// --- ROTAS PARA SERVIR AS PÁGINAS HTML ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/manage.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'manage.html')));
app.get('/search.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/edit.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));

// --- Inicia o servidor ---
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});