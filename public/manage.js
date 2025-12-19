// public/manage.js

/**
 * Função principal que inicializa a página de gerenciamento.
 * Ela é executada assim que o DOM (HTML) termina de carregar.
 */
async function initializeManagePage() {
    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');

    /**
     * Renderiza a lista de textos no HTML com base em um array fornecido.
     * @param {Array} texts - Lista de objetos vindo do banco local.
     */
    const renderTexts = (texts) => {
        textsContainer.innerHTML = '';

        if (!texts || texts.length === 0) {
            textsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <p>Nenhum texto encontrado. Crie um novo para começar!</p>
                </div>`;
            return;
        }

        texts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            
            // Aqui montamos a estrutura compatível com o novo CSS profissional
            div.innerHTML = `
                <h3>${item.title || 'Sem título'}</h3>
                <p>${item.text}</p>
                <div class="actions">
                    <button class="btn-copy" onclick="copyToClipboard('${item.text.replace(/'/g, "\\'").replace(/\n/g, "\\n")}', this)">Copiar</button>
                    <button class="btn-edit" onclick="window.location.href='/edit.html?id=${item.id}'">Editar</button>
                    <button class="btn-del" onclick="deleteText(${item.id})">Excluir</button>
                </div>
            `;
            textsContainer.appendChild(div);
        });
    };

    /**
     * Busca os dados no Dexie (IndexedDB), filtra se houver pesquisa e manda renderizar.
     */
    const fetchAndRender = async () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Pegamos todos os textos do banco local, do mais novo para o mais antigo
        let texts = await db.feedbacks.reverse().toArray();

        if (searchTerm) {
            texts = texts.filter(t => 
                (t.title && t.title.toLowerCase().includes(searchTerm)) || 
                (t.text && t.text.toLowerCase().includes(searchTerm))
            );
        }
        renderTexts(texts);
    };

    /**
     * Função Global para deletar um texto.
     */
    window.deleteText = async (id) => {
        if (confirm("Deseja realmente excluir este texto permanentemente do seu dispositivo?")) {
            await db.feedbacks.delete(id);
            await fetchAndRender();
        }
    };

    /**
     * Função Global para copiar o texto para o clipboard.
     */
    window.copyToClipboard = (text, btn) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'Copiado!';
            btn.style.background = '#22c55e'; // Verde de sucesso
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = ''; // Volta ao padrão do CSS
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar: ', err);
            alert("Erro ao copiar texto.");
        });
    };

    /**
     * Função Global para Exportar Backup (Gera arquivo JSON).
     */
    window.exportBackup = async () => {
        const data = await db.feedbacks.toArray();
        if (data.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_lazycopy_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    /**
     * Função Global para Importar Backup (Lê arquivo JSON).
     */
    window.importBackup = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    // bulkPut insere ou atualiza mantendo os IDs
                    await db.feedbacks.bulkPut(data);
                    alert("Backup importado com sucesso!");
                    await fetchAndRender();
                } else {
                    throw new Error("Formato inválido");
                }
            } catch (err) {
                alert("Erro ao importar backup. Certifique-se de que é um arquivo JSON válido do LazyCopy.");
                console.error(err);
            }
            // Limpa o input de arquivo para permitir importar o mesmo arquivo de novo se necessário
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    // Escuta o campo de busca
    searchInput.addEventListener('input', fetchAndRender);

    // Carregamento inicial
    await fetchAndRender();
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeManagePage);