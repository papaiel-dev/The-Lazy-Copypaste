function initializeSearchPage() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeSearchPage, 100);
        return;
    }
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('suggestions-box');
    const displayBox = document.getElementById('feedback-display');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-text');
    const copyButton = document.getElementById('copy-button');
    const closeViewBtn = document.getElementById('close-view-btn');
    let debounceTimer;

    const renderSuggestions = (feedbacks, query = '') => {
        suggestionsBox.innerHTML = ''; 
        displayBox.style.display = 'none';
        if (!feedbacks || feedbacks.length === 0) {
            suggestionsBox.style.display = 'block';
            let emptyStateHTML = '';
            if (query) {
                emptyStateHTML = `<div class="empty-state-search"><h3>Nenhum resultado para "${query}"</h3><p>Tente refinar sua busca.</p></div>`;
            } else {
                emptyStateHTML = `<div class="empty-state"><h2>Nenhum feedback cadastrado.</h2><p>Vá para a área de gerenciamento para criar seu primeiro feedback.</p><a href="/manage.html" class="btn-primary">Gerenciar Feedbacks</a></div>`;
            }
            suggestionsBox.innerHTML = emptyStateHTML;
            return;
        }
        suggestionsBox.style.display = 'block';
        feedbacks.forEach(fb => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = fb.title;
            suggestionItem.onclick = () => selectFeedback(fb);
            suggestionsBox.appendChild(suggestionItem);
        });
    };
    
    const fetchSuggestions = async (query) => {
        if (query.length < 1) {
            loadInitialList(); 
            return;
        }
        const { data: feedbacks, error } = await supabase.from('feedbacks').select('*').ilike('title', `%${query}%`).order('title', { ascending: true });
        if (error) console.error('Erro ao buscar:', error);
        else renderSuggestions(feedbacks, query);
    };

    const loadInitialList = async () => {
        const { data: feedbacks, error } = await supabase.from('feedbacks').select('*').order('title', { ascending: true });
        if (error) console.error('Erro ao carregar lista:', error);
        else renderSuggestions(feedbacks);
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
        debounceTimer = setTimeout(() => fetchSuggestions(searchInput.value), 250);
    });
    document.addEventListener('click', (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
            suggestionsBox.style.display = 'none';
        }
    });
    closeViewBtn.addEventListener('click', resetToListView);
    loadInitialList();
}
document.addEventListener('DOMContentLoaded', initializeSearchPage);