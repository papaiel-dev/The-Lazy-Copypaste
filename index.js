require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const supabaseAdmin = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const pageProtectionMiddleware = async (req, res, next) => {
    const token = req.cookies['sb-access-token'];
    if (!token) {
        return res.redirect('/');
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
        res.clearCookie('sb-access-token', { path: '/' });
        res.clearCookie('sb-refresh-token', { path: '/' });
        return res.redirect('/');
    }
    req.user = user;
    next();
};

app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.PUBLIC_SUPABASE_ANON_KEY,
    });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/reset-password.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'reset-password.html')));
app.get('/dashboard.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/manage.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'manage.html')));
app.get('/search.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/edit.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));
app.get('/edit/:id', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit.html')));
app.get('/account.html', pageProtectionMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'account.html')));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});