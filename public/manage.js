// Função do Modal Blindada
function showModal(title, text, confirmCallback = null) {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalButtons = document.getElementById('modalButtons');

    modalTitle.textContent = title;
    modalText.textContent = text;
    modalButtons.innerHTML = '';

    if (confirmCallback) {
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn btn-secondary';
        btnCancel.textContent = 'Cancelar';
        btnCancel.onclick = () => modal.style.display = 'none';

        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn btn-danger';
        btnConfirm.textContent = 'Sim, excluir';
        btnConfirm.onclick = () => {
            confirmCallback();
            modal.style.display = 'none';
        };
        modalButtons.appendChild(btnCancel);
        modalButtons.appendChild(btnConfirm);
    } else {
        const btnOk = document.createElement('button');
        btnOk.className = 'btn btn-primary';
        btnOk.textContent = 'OK';
        btnOk.onclick = () => modal.style.display = 'none';
        modalButtons.appendChild(btnOk);
    }
    modal.style.display = 'flex';
}

async function initializeManagePage() {
    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');

    const renderTexts = (texts) => {
        textsContainer.innerHTML = '';
        if (!texts || texts.length === 0) {
            textsContainer.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:50px;">Nada encontrado.</p>`;
            return;
        }

        texts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            div.innerHTML = `
                <div class="item-header">
                    <h3 class="item-title">${item.title || 'Sem título'}</h3>
                    <button class="btn btn-success" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyToClipboard('${item.text.replace(/'/g, "\\'").replace(/\n/g, "\\n")}', this)">Copiar</button>
                </div>
                <div class="text-container text-collapsed" id="container-${item.id}">
                    <div class="text-content">${item.text}</div>
                    <div class="fade-overlay"></div>
                </div>
                <div class="actions">
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.75rem;" onclick="toggleExpand(${item.id}, this)">Ver mais</button>
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.75rem;" onclick="window.location.href='/edit.html?id=${item.id}'">Editar</button>
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.75rem; color: #ef4444;" onclick="deleteText(${item.id})">Excluir</button>
                </div>
            `;
            textsContainer.appendChild(div);
        });
    };

    window.toggleExpand = (id, btn) => {
        const container = document.getElementById(`container-${id}`);
        const isCollapsed = container.classList.contains('text-collapsed');
        container.classList.toggle('text-collapsed');
        btn.textContent = isCollapsed ? 'Ver menos' : 'Ver mais';
    };

    window.copyToClipboard = (text, btn) => {
        navigator.clipboard.writeText(text).then(() => {
            const oldText = btn.textContent;
            btn.textContent = 'Copiado!';
            setTimeout(() => btn.textContent = oldText, 2000);
        });
    };

    window.deleteText = (id) => {
        showModal("Excluir", "Deseja mesmo apagar este texto?", async () => {
            await db.feedbacks.delete(id);
            fetchAndRender();
        });
    };

    window.exportBackup = async () => {
        const data = await db.feedbacks.toArray();
        const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `backup_lazy.json`;
        a.click();
        showModal("Backup", "Backup baixado com sucesso!");
    };

    window.importBackup = (event) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                await db.feedbacks.bulkPut(data);
                showModal("Backup", "Dados importados!");
                fetchAndRender();
            } catch(err) { showModal("Erro", "Arquivo inválido."); }
        };
        reader.readAsText(event.target.files[0]);
    };

    const fetchAndRender = async () => {
        const term = searchInput.value.toLowerCase();
        let texts = await db.feedbacks.reverse().toArray();
        if (term) texts = texts.filter(t => t.title.toLowerCase().includes(term) || t.text.toLowerCase().includes(term));
        renderTexts(texts);
    };

    searchInput.addEventListener('input', fetchAndRender);
    fetchAndRender();
}
document.addEventListener('DOMContentLoaded', initializeManagePage);