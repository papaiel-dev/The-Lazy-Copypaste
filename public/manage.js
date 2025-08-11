function initializeManagePage() {
    if (typeof supabase === 'undefined' || !supabase) {
        setTimeout(initializeManagePage, 100);
        return;
    }

    const textsContainer = document.getElementById('textsContainer');
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    const renderTexts = (texts) => {
        textsContainer.innerHTML = '';
        if (!texts || texts.length === 0) {
            const emptyStateHTML = `
                <div class="empty-state">
                    <h2>Nenhum texto por aqui ainda!</h2>
                    <p>Que tal começar cadastrando seu primeiro texto?</p>
                    <a href="/edit.html" class="btn-primary">Criar meu primeiro texto</a>
                </div>
            `;
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
                deleteBtn.onclick = async () => {
                    if (confirm(`Tem certeza que deseja excluir o texto "${item.title}"?`)) {
                        const { error } = await supabase.from('feedbacks').delete().eq('id', item.id);
                        if (error) {
                            alert('Falha ao excluir: ' + error.message);
                        } else {
                            fetchAndRender();
                        }
                    }
                };
                
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

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fetchAndRender, 300);
    });

    fetchAndRender();
}

document.addEventListener('DOMContentLoaded', initializeManagePage);