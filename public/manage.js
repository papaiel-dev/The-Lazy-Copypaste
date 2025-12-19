async function initializeManagePage() {
    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');

    const renderTexts = (texts) => {
        textsContainer.innerHTML = '';
        if (texts.length === 0) {
            textsContainer.innerHTML = '<p>Nenhum texto encontrado.</p>';
            return;
        }

        texts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            div.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.text}</p>
                <div class="actions">
                    <button onclick="copyToClipboard('${item.text.replace(/'/g, "\\'")}')">Copiar</button>
                    <button onclick="window.location.href='/edit.html?id=${item.id}'">Editar</button>
                    <button onclick="deleteText(${item.id})">Excluir</button>
                </div>
            `;
            textsContainer.appendChild(div);
        });
    };

    const fetchAndRender = async () => {
        const term = searchInput.value.toLowerCase();
        let texts = await db.feedbacks.reverse().toArray();
        if (term) {
            texts = texts.filter(t => t.title.toLowerCase().includes(term) || t.text.toLowerCase().includes(term));
        }
        renderTexts(texts);
    };

    window.copyToClipboard = (txt) => {
        navigator.clipboard.writeText(txt);
        alert("Copiado!");
    };

    window.deleteText = async (id) => {
        if (confirm("Excluir permanentemente?")) {
            await db.feedbacks.delete(id);
            fetchAndRender();
        }
    };

    window.exportBackup = async () => {
        const data = await db.feedbacks.toArray();
        const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `backup_lazy_${new Date().toISOString().split('T')[0]}.json`;
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