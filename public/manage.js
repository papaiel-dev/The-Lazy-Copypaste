function initializeManagePage() {
    if (typeof supabase === 'undefined' || !supabase) {
        setTimeout(initializeManagePage, 100);
        return;
    }

    const feedbackContainer = document.getElementById('feedbackContainer');
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    const renderFeedbacks = (feedbacks) => {
        feedbackContainer.innerHTML = '';
        if (!feedbacks || feedbacks.length === 0) {
            const emptyStateHTML = `
                <div class="empty-state">
                    <h2>Nenhum texto por aqui ainda!</h2>
                    <p>Que tal começar cadastrando seu primeiro texto?</p>
                    <a href="/edit.html" class="btn-primary">Criar meu primeiro texto</a>
                </div>
            `;
            feedbackContainer.innerHTML = emptyStateHTML;
            return;
        }

        const grouped = feedbacks.reduce((acc, fb) => {
            (acc[fb.title] = acc[fb.title] || []).push(fb);
            return acc;
        }, {});

        for (const title in grouped) {
            const groupEl = document.createElement('div');
            groupEl.className = 'feedback-group';
            const titleEl = document.createElement('h2');
            titleEl.className = 'group-title';
            titleEl.textContent = title;
            groupEl.appendChild(titleEl);

            grouped[title].forEach(fb => {
                const itemEl = document.createElement('div');
                itemEl.className = 'feedback-item';
                const textEl = document.createElement('p');
                textEl.textContent = fb.text;
                const buttonWrapper = document.createElement('div');
                buttonWrapper.className = 'button-wrapper';

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = 'Editar';
                editBtn.onclick = () => window.location.href = `/edit.html?id=${fb.id}`;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Excluir';
                deleteBtn.onclick = async () => {
                    if (confirm(`Tem certeza que deseja excluir o texto "${fb.title}"?`)) {
                        const { error } = await supabase.from('feedbacks').delete().eq('id', fb.id);
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
            feedbackContainer.appendChild(groupEl);
        }
    };

    const fetchAndRender = async () => {
        const searchTerm = searchInput.value.trim();
        let query = supabase.from('feedbacks').select('*').order('title', { ascending: true });

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`);
        }

        const { data: feedbacks, error } = await query;
        
        if (error) {
            console.error("Erro ao buscar textos:", error);
            feedbackContainer.innerHTML = '<p style="color:red;">Erro ao carregar os dados.</p>';
        } else {
            renderFeedbacks(feedbacks);
        }
    };

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fetchAndRender, 300);
    });

    fetchAndRender();
}

document.addEventListener('DOMContentLoaded', initializeManagePage);