function initializeEditPage() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeEditPage, 100);
        return;
    }

    const form = document.getElementById('editForm');
    const pageTitle = document.getElementById('page-title');
    const titleInput = document.getElementById('title');
    const textInput = document.getElementById('text');
    const backButton = document.getElementById('backButton');
    const saveButton = document.getElementById('saveButton');
    const statusMessage = document.getElementById('status-message');
    const successModal = document.getElementById('success-modal');
    const successMessageText = document.getElementById('success-message-text');
    const goToManageBtn = document.getElementById('go-to-manage-btn');
    const createAnotherBtn = document.getElementById('create-another-btn');
    
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackId = urlParams.get('id');
    const isEditing = !!feedbackId;

    const showErrorMessage = (message) => {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message error';
        statusMessage.style.display = 'block';
        setTimeout(() => { statusMessage.style.display = 'none'; }, 4000);
    };

    const openSuccessModal = (message) => {
        successMessageText.textContent = message;
        successModal.style.display = 'flex';
    };
    const closeSuccessModal = () => successModal.style.display = 'none';

    if (isEditing) {
        pageTitle.textContent = 'Editar Feedback';
        supabase.from('feedbacks').select('*').eq('id', feedbackId).single()
            .then(({ data: feedback, error }) => {
                if (error || !feedback) {
                    alert('Feedback não encontrado ou você não tem permissão.');
                    window.location.href = '/manage.html';
                } else {
                    titleInput.value = feedback.title;
                    textInput.value = feedback.text;
                }
            });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert('Você não está logado.');

        const feedbackData = {
            title: titleInput.value.trim(),
            text: textInput.value.trim(),
            userId: user.id
        };

        let query;
        if (isEditing) {
            // Remove o userId para não tentar atualizar, pois ele não deve mudar
            delete feedbackData.userId;
            query = supabase.from('feedbacks').update(feedbackData).eq('id', feedbackId);
        } else {
            query = supabase.from('feedbacks').insert(feedbackData);
        }

        const { error } = await query;
        
        if (error) {
            if (error.message.includes('unique_user_title')) {
                showErrorMessage('Falha ao Salvar: Você já possui um feedback com este título.');
            } else {
                showErrorMessage(`Falha ao Salvar: ${error.message}`);
            }
        } else {
            const successMsg = isEditing ? 'Feedback atualizado!' : 'Feedback criado!';
            openSuccessModal(successMsg);
        }
        
        saveButton.disabled = false;
        saveButton.textContent = 'Salvar';
    });

    backButton.addEventListener('click', () => window.location.href = '/manage.html');
    goToManageBtn.addEventListener('click', () => window.location.href = '/manage.html');
    createAnotherBtn.addEventListener('click', () => {
        if(isEditing) {
            // Se estava editando, voltar para a lista é mais seguro
            window.location.href = '/manage.html';
        } else {
            closeSuccessModal();
            form.reset();
            titleInput.focus();
        }
    });
}
document.addEventListener('DOMContentLoaded', initializeEditPage);