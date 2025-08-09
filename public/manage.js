document.addEventListener('DOMContentLoaded', () => {
    const feedbackContainer = document.getElementById('feedbackContainer');
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    const renderFeedbacks = (feedbacks) => {
        feedbackContainer.innerHTML = '';
        if (feedbacks.length === 0) {
            const emptyStateHTML = `
                <div class="empty-state">
                    <h2>Nenhum feedback por aqui ainda!</h2>
                    <p>Que tal começar cadastrando seu primeiro feedback?</p>
                    <a href="/edit" class="btn-primary">Criar meu primeiro feedback</a>
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

                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.textContent = 'Copiar';
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(fb.text);
                    copyBtn.textContent = 'Copiado!';
                    setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 2000);
                };

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = 'Editar';
                editBtn.onclick = () => {
                    window.location.href = `/edit/${fb.id}`;
                };

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Excluir';
                deleteBtn.onclick = async () => {
                    if (confirm(`Tem certeza que deseja excluir o feedback?`)) {
                        try {
                            await fetch(`/api/feedbacks/${fb.id}`, { method: 'DELETE' });
                            fetchAndRender();
                        } catch (error) {
                            alert('Falha ao excluir.');
                        }
                    }
                };

                buttonWrapper.appendChild(copyBtn);
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
        const searchTerm = searchInput.value;
        let url = '/api/feedbacks';
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            renderFeedbacks(data.feedbacks);
        } catch (error) {
            console.error("Erro ao buscar feedbacks:", error);
            feedbackContainer.innerHTML = '<p style="color:red;">Erro ao carregar dados.</p>';
        }
    };

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fetchAndRender, 300);
    });

    fetchAndRender();
});