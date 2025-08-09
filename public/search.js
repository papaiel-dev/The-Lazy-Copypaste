document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('suggestions-box');
    
    const displayBox = document.getElementById('feedback-display');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-text');
    const copyButton = document.getElementById('copy-button');
    const closeViewBtn = document.getElementById('close-view-btn');

    let debounceTimer;

    const renderSuggestions = (feedbacks) => {
        suggestionsBox.innerHTML = ''; 
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
            suggestionsBox.style.display = 'none';
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
            renderSuggestions(feedbacks);
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