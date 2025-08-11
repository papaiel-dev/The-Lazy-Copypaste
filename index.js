// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para servir todos os nossos arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para simular a Função Serverless e fornecer as chaves do Supabase
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.PUBLIC_SUPABASE_ANON_KEY,
    });
});

// Uma rota "catch-all" para garantir que o refresh em páginas internas funcione
// Ex: Se você estiver em /dashboard.html e der F5, ele não dará 404.
app.get('*', (req, res) => {
    // Verifica se o arquivo solicitado existe na pasta public
    const filePath = path.join(__dirname, 'public', req.path);
    if (require('fs').existsSync(filePath) && !require('fs').lstatSync(filePath).isDirectory()) {
        res.sendFile(filePath);
    } else {
        // Se não encontrar o arquivo, serve o index.html (bom para Single Page Apps)
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor de desenvolvimento local rodando em http://localhost:${port}`);
});