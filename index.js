require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const pageProtectionMiddleware = (req, res, next) => {
    const token = req.cookies['sb-access-token'];
    if (!token) return res.redirect('/');
    next();
};

app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.PUBLIC_SUPABASE_ANON_KEY,
    });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
// ... (e todas as outras rotas para servir as páginas .html)
app.get('/dashboard.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/manage.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'manage.html')));
app.get('/search.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/edit.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));
app.get('/edit/:id', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));
app.get('/reset-password.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'reset-password.html')));
app.get('/account.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'account.html')));


app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));