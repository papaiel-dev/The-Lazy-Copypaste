async function initializeManagePage() {
    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');

    const renderTexts = (texts) => {
        textsContainer.innerHTML = '';
        if (!texts || texts.length === 0) {
            textsContainer.innerHTML = `
                <div style="text-align: center; padding: 60px; color: var(--text-color-light);">
                    <p>Ainda não tens textos salvos. Cria um novo para começar!</p>
                </div>`;
            return;
        }

        texts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            div.innerHTML = `
                <div class="item-header">
                    <h3 class="item-title">${item.title || 'Sem título'}</h3>
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.85rem; background-color: var(--success-color);" onclick="copyToClipboard('${item.text.replace(/'/g, "\\'").replace(/\n/g, "\\n")}', this)">Copiar</button>
                </div>
                <p>${item.text}</p>
                <div class="item-actions">
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="window.location.href='/edit.html?id=${item.id}'">Editar</button>
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; color: var(--danger-color); border-color: #fee2e2;" onclick="deleteText(${item.id})">Excluir</button>
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
        if (confirm("Apagar este texto permanentemente?")) {
            await db.feedbacks.delete(id);
            fetchAndRender();
        }
    };

    window.exportBackup = async () => {
        const data = await db.feedbacks.toArray();
        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `backup_lazycopypaste.json`;
        a.click();
    };

    window.importBackup = (event) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = JSON.parse(e.target.result);
            await db.feedbacks.bulkPut(data);
            alert("Backup restaurado com sucesso!");
            fetchAndRender();
        };
        reader.readAsText(event.target.files[0]);
    };

    searchInput.addEventListener('input', fetchAndRender);
    fetchAndRender();
}
document.addEventListener('DOMContentLoaded', initializeManagePage);