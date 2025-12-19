/**
 * Lógica de Gerenciamento de Textos - Local-First
 */

async function initializeManagePage() {
    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');

    const renderTexts = (texts) => {
        textsContainer.innerHTML = '';

        if (!texts || texts.length === 0) {
            textsContainer.innerHTML = `
                <div class="empty-state">
                    <h2>Nenhum texto encontrado.</h2>
                    <p>Crie um novo texto ou importe um backup.</p>
                </div>`;
            return;
        }

        texts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            div.innerHTML = `
                <div class="item-header">
                    <h3 class="item-title">${item.title || 'Sem título'}</h3>
                    <button class="copy-btn" onclick="copyToClipboard('${item.text.replace(/'/g, "\\'").replace(/\n/g, "\\n")}', this)">Copiar</button>
                </div>
                <p>${item.text}</p>
                <div class="item-actions">
                    <button class="edit-btn" onclick="window.location.href='/edit.html?id=${item.id}'">Editar</button>
                    <button class="delete-btn" onclick="deleteText(${item.id})">Excluir</button>
                </div>
            `;
            textsContainer.appendChild(div);
        });
    };

    const fetchAndRender = async () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let texts = await db.feedbacks.reverse().toArray();

        if (searchTerm) {
            texts = texts.filter(t => 
                (t.title && t.title.toLowerCase().includes(searchTerm)) || 
                (t.text && t.text.toLowerCase().includes(searchTerm))
            );
        }
        renderTexts(texts);
    };

    window.copyToClipboard = (text, btn) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'Copiado!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
    };

    window.deleteText = async (id) => {
        if (confirm("Excluir permanentemente?")) {
            await db.feedbacks.delete(id);
            fetchAndRender();
        }
    };

    window.exportBackup = async () => {
        const data = await db.feedbacks.toArray();
        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `backup_lazycopy.json`;
        a.click();
    };

    window.importBackup = (event) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = JSON.parse(e.target.result);
            await db.feedbacks.bulkPut(data);
            alert("Backup importado!");
            fetchAndRender();
        };
        reader.readAsText(event.target.files[0]);
    };

    searchInput.addEventListener('input', fetchAndRender);
    fetchAndRender();
}

document.addEventListener('DOMContentLoaded', initializeManagePage);