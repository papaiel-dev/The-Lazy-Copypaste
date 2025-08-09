document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('suggestions-box');
    
    const displayBox = document.getElementById('feedback-display');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-text');
    const copyButton = document.getElementById('copy-button');
    const closeViewBtn = document.getElementById('close-view-btn');

    let debounceTimer;

    // Função de renderização agora lida com o estado vazio
    const renderSuggestions = (feedbacks, query = '') => {
        suggestionsBox.innerHTML = ''; 
        displayBox.style.display = 'none'; // Sempre esconde o display ao renderizar a lista
        
        if (feedbacks.length > 0) {
            suggestionsBox.style.display = 'block';
            feedbacks.forEach(fb => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.textContent = fb.title;
                suggestionItem.onclick = () => selectFeedback(fb);
                suggestionsBox.appendChild(suggestionItem);
            });
        } else {
            // Se não houver feedbacks, mostra uma mensagem de estado vazio
            suggestionsBox.style.display = 'block'; // Mostra a caixa para conter a mensagem
            let emptyStateHTML = '';

            if (query) {
                // Mensagem para quando uma BUSCA não retorna nada
                emptyStateHTML = `
                    <div class="empty-state-search">
                        <h3>Nenhum resultado encontrado para "${query}"</h3>
                        <p>Tente refinar seus termos de busca.</p>
                    </div>
                `;
            } else {
                // Mensagem para quando NÃO HÁ NENHUM FEEDBACK CADASTRADO
                emptyStateHTML = `
                    <div class="empty-state">
                        <h2>Nenhum feedback por aqui ainda!</h2>
                        <p>Vá para a área de gerenciamento para criar seu primeiro feedback.</p>
                        <a href="/manage.html" class="btn-primary">Gerenciar Feedbacks</a>
                    </div>
                `;
            }
            suggestionsBox.innerHTML = emptyStateHTML;
        }
    };
    
    const fetchSuggestions = async (query) => {
        if (query.length < 1) {
            loadInitialList(); 
            return;
        }
        try {
            const response = await fetch(`/api/feedbacks?search=${encodeURIComponent(query)}`);
            const { feedbacks } = await response.json();
            renderSuggestions(feedbacks, query);
        } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
        }
    };

    const loadInitialList = async () => {
        try {
            const response = await fetch('/api/feedbacks');
            const { feedbacks } = await response.json();
            renderSuggestions(feedbacks);
        } catch (error) {
            console.error('Erro ao carregar a lista inicial:', error);
        }
    };

    const selectFeedback = (feedback) => {
        feedbackTitle.textContent = feedback.title;
        feedbackText.textContent = feedback.text;
        displayBox.style.display = 'block';
        suggestionsBox.style.display = 'none';
        searchInput.value = '';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(feedback.text);
            copyButton.textContent = 'Copiado!';
            setTimeout(() => { copyButton.textContent = 'Copiar Texto'; }, 2000);
        };
    };
    
    const resetToListView = () => {
        displayBox.style.display = 'none';
        loadInitialList();
    };

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetchSuggestions(searchInput.value);
        }, 250);
    });

    document.addEventListener('click', (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
            suggestionsBox.style.display = 'none';
        }
    });

    closeViewBtn.addEventListener('click', resetToListView);

    loadInitialList();
});