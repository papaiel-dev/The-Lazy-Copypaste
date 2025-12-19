const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir páginas sem .html na URL
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    if (page.includes('.')) return next();
    res.sendFile(path.join(__dirname, 'public', `${page}.html`), (err) => {
        if (err) next();
    });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));