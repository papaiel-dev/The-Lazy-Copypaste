function initializeManagePage() {
    if (typeof supabase === 'undefined' || !supabase) {
        setTimeout(initializeManagePage, 100);
        return;
    }

    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    const deleteModal = document.getElementById('delete-text-modal');
    const deleteConfirmText = document.getElementById('delete-confirm-text');
    const cancelDeleteBtn = document.getElementById('cancel-delete-text-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-text-btn');
    const modalCloseBtn = deleteModal.querySelector('.modal-close');
    let textToDelete = null;

    const openDeleteModal = (textItem) => {
        textToDelete = textItem;
        deleteConfirmText.textContent = `Tem certeza que deseja excluir o texto "${textItem.title}"? Esta ação não pode ser desfeita.`;
        deleteModal.style.display = 'flex';
    };
    const closeDeleteModal = () => {
        textToDelete = null;
        deleteModal.style.display = 'none';
    };

    const renderTexts = (texts) => {
        textsContainer.innerHTML = '';
        if (!texts || texts.length === 0) {
            const emptyStateHTML = `<div class="empty-state"><h2>Nenhum texto por aqui ainda!</h2><p>Que tal começar cadastrando seu primeiro texto?</p><a href="/edit.html" class="btn-primary">Criar meu primeiro texto</a></div>`;
            textsContainer.innerHTML = emptyStateHTML;
            return;
        }

        const grouped = texts.reduce((acc, item) => {
            const category = item.category || 'Sem Categoria';
            (acc[category] = acc[category] || []).push(item);
            return acc;
        }, {});

        const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'pt-BR'));

        for (const category of sortedCategories) {
            const groupEl = document.createElement('div');
            groupEl.className = 'feedback-group';
            const titleEl = document.createElement('h2');
            titleEl.className = 'group-title';
            titleEl.textContent = category;
            groupEl.appendChild(titleEl);
            
            grouped[category].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { numeric: true, sensitivity: 'base' }));

            grouped[category].forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'feedback-item';
                
                const itemHeader = document.createElement('div');
                itemHeader.className = 'item-header';

                const titleTextEl = document.createElement('h3');
                titleTextEl.className = 'item-title';
                titleTextEl.textContent = item.title;

                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn btn-icon';
                copyBtn.textContent = 'Copiar';
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(item.text);
                    copyBtn.textContent = 'Copiado!';
                    setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 2000);
                };
                
                itemHeader.appendChild(titleTextEl);
                itemHeader.appendChild(copyBtn);

                const textEl = document.createElement('p');
                textEl.textContent = item.text;
                
                const isLongText = item.text.length > 200;
                if (isLongText) { textEl.classList.add('text-preview'); }

                const buttonWrapper = document.createElement('div');
                buttonWrapper.className = 'button-wrapper';
                
                if (isLongText) {
                    const showMoreBtn = document.createElement('button');
                    showMoreBtn.className = 'show-more-btn';
                    showMoreBtn.textContent = 'Mostrar Mais';
                    showMoreBtn.onclick = () => {
                        textEl.classList.toggle('text-preview');
                        buttonWrapper.classList.toggle('visible');
                        showMoreBtn.textContent = textEl.classList.contains('text-preview') ? 'Mostrar Mais' : 'Mostrar Menos';
                    };
                    itemHeader.appendChild(showMoreBtn);
                }

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = 'Editar';
                editBtn.onclick = () => window.location.href = `/edit.html?id=${item.id}`;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Excluir';
                deleteBtn.onclick = () => openDeleteModal(item);
                
                buttonWrapper.appendChild(editBtn);
                buttonWrapper.appendChild(deleteBtn);
                
                itemEl.appendChild(itemHeader);
                itemEl.appendChild(textEl);
                itemEl.appendChild(buttonWrapper);
                groupEl.appendChild(itemEl);
            });
            textsContainer.appendChild(groupEl);
        }
    };

    const fetchAndRender = async () => {
        const searchTerm = searchInput.value.trim();
        let query = supabase.from('feedbacks').select('*');
        if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`);
        }
        
        const { data: texts, error } = await query;
        if (error) {
            console.error("Erro ao buscar textos:", error);
            textsContainer.innerHTML = '<p style="color:red;">Erro ao carregar os dados.</p>';
        } else {
            renderTexts(texts);
        }
    };
    
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    modalCloseBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!textToDelete) return;
        const { error } = await supabase.from('feedbacks').delete().eq('id', textToDelete.id);
        if (error) {
            alert('Falha ao excluir: ' + error.message);
        } else {
            closeDeleteModal();
            fetchAndRender();
        }
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fetchAndRender, 300);
    });

    fetchAndRender();
}
document.addEventListener('DOMContentLoaded', initializeManagePage);