function initializeManagePage() {
    if (typeof supabase === 'undefined' || !supabase) {
        setTimeout(initializeManagePage, 100);
        return;
    }

    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    // Elementos do Modal de Exclusão
    const deleteModal = document.getElementById('delete-text-modal');
    const deleteConfirmText = document.getElementById('delete-confirm-text');
    const cancelDeleteBtn = document.getElementById('cancel-delete-text-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-text-btn');
    const modalCloseBtn = deleteModal.querySelector('.modal-close');

    let textToDelete = null; // Variável para guardar o item a ser deletado

    const openDeleteModal = (textItem) => {
        textToDelete = textItem;
        deleteConfirmText.textContent = `Você tem certeza que deseja excluir o texto "${textItem.title}"? Esta ação não pode ser desfeita.`;
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
            (acc[item.title] = acc[item.title] || []).push(item);
            return acc;
        }, {});

        for (const title in grouped) {
            const groupEl = document.createElement('div');
            groupEl.className = 'feedback-group';
            const titleEl = document.createElement('h2');
            titleEl.className = 'group-title';
            titleEl.textContent = title;
            groupEl.appendChild(titleEl);

            grouped[title].forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'feedback-item';
                const textEl = document.createElement('p');
                textEl.textContent = item.text;
                const buttonWrapper = document.createElement('div');
                buttonWrapper.className = 'button-wrapper';

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = 'Editar';
                editBtn.onclick = () => window.location.href = `/edit.html?id=${item.id}`;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Excluir';
                // Agora o botão de excluir abre o modal
                deleteBtn.onclick = () => openDeleteModal(item);
                
                buttonWrapper.appendChild(editBtn);
                buttonWrapper.appendChild(deleteBtn);
                itemEl.appendChild(textEl);
                itemEl.appendChild(buttonWrapper);
                groupEl.appendChild(itemEl);
            });
            textsContainer.appendChild(groupEl);
        }
    };

    const fetchAndRender = async () => {
        const searchTerm = searchInput.value.trim();
        let query = supabase.from('feedbacks').select('*').order('title', { ascending: true });
        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`);
        }
        const { data: texts, error } = await query;
        if (error) {
            console.error("Erro ao buscar textos:", error);
            textsContainer.innerHTML = '<p style="color:red;">Erro ao carregar os dados.</p>';
        } else {
            renderTexts(texts);
        }
    };
    
    // Listeners do Modal
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    modalCloseBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!textToDelete) return;

        const { error } = await supabase.from('feedbacks').delete().eq('id', textToDelete.id);
        
        if (error) {
            alert('Falha ao excluir: ' + error.message); // Mantemos um alert aqui para erros inesperados
        } else {
            closeDeleteModal();
            fetchAndRender(); // Recarrega a lista
        }
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fetchAndRender, 300);
    });

    fetchAndRender();
}
document.addEventListener('DOMContentLoaded', initializeManagePage);