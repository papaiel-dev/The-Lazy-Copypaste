async function initializeManagePage() {
    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');

    const renderTexts = (texts) => {
        textsContainer.innerHTML = '';
        if (!texts || texts.length === 0) {
            textsContainer.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:50px;">Nenhum texto encontrado.</p>`;
            return;
        }

        texts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            div.innerHTML = `
                <div class="item-header">
                    <h3 class="item-title">${item.title || 'Sem título'}</h3>
                    <button class="btn btn-success" style="padding: 8px 16px;" onclick="copyToClipboard('${item.text.replace(/'/g, "\\'").replace(/\n/g, "\\n")}', this)">Copiar</button>
                </div>
                
                <div class="text-container text-collapsed" id="container-${item.id}">
                    <div class="text-content">${item.text}</div>
                    <div class="fade-overlay"></div>
                </div>

                <div class="actions">
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.75rem;" onclick="toggleExpand(${item.id}, this)">Ver mais</button>
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.75rem;" onclick="window.location.href='/edit.html?id=${item.id}'">Editar</button>
                    <button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.75rem;" onclick="deleteText(${item.id})">Excluir</button>
                </div>
            `;
            textsContainer.appendChild(div);
        });
    };

    window.toggleExpand = (id, btn) => {
        const container = document.getElementById(`container-${id}`);
        const isCollapsed = container.classList.contains('text-collapsed');
        
        if (isCollapsed) {
            container.classList.remove('text-collapsed');
            btn.textContent = 'Ver menos';
        } else {
            container.classList.add('text-collapsed');
            btn.textContent = 'Ver mais';
        }
    };

    const fetchAndRender = async () => {
        const term = searchInput.value.toLowerCase();
        let texts = await db.feedbacks.reverse().toArray();
        if (term) {
            texts = texts.filter(t => 
                (t.title && t.title.toLowerCase().includes(term)) || 
                (t.text && t.text.toLowerCase().includes(term))
            );
        }
        renderTexts(texts);
    };

    window.copyToClipboard = (text, btn) => {
        navigator.clipboard.writeText(text).then(() => {
            const oldText = btn.textContent;
            btn.textContent = 'Copiado!';
            setTimeout(() => btn.textContent = oldText, 2000);
        });
    };

    window.deleteText = async (id) => {
        if (confirm("Apagar permanentemente?")) {
            await db.feedbacks.delete(id);
            fetchAndRender();
        }
    };

    window.exportBackup = async () => {
        const data = await db.feedbacks.toArray();
        const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `backup_lazy.json`;
        a.click();
    };

    window.importBackup = (event) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                await db.feedbacks.bulkPut(data);
                alert("Backup restaurado!");
                fetchAndRender();
            } catch(err) {
                alert("Erro ao importar arquivo.");
            }
        };
        reader.readAsText(event.target.files[0]);
    };

    searchInput.addEventListener('input', fetchAndRender);
    fetchAndRender();
}
document.addEventListener('DOMContentLoaded', initializeManagePage);