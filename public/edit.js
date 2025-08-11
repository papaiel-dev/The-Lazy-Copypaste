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
    const textId = urlParams.get('id');
    const isEditing = !!textId;

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
        pageTitle.textContent = 'Editar Texto';
        supabase.from('feedbacks').select('*').eq('id', textId).single()
            .then(({ data: textData, error }) => {
                if (error || !textData) {
                    alert('Texto não encontrado ou você não tem permissão.');
                    window.location.href = '/manage.html';
                } else {
                    titleInput.value = textData.title;
                    textInput.value = textData.text;
                }
            });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert('Você não está logado.');

        const textDataPayload = {
            title: titleInput.value.trim(),
            text: textInput.value.trim(),
            userId: user.id
        };

        let query;
        if (isEditing) {
            delete textDataPayload.userId; // Não se atualiza o dono do texto
            query = supabase.from('feedbacks').update(textDataPayload).eq('id', textId);
        } else {
            query = supabase.from('feedbacks').insert(textDataPayload);
        }

        const { error } = await query;
        
        if (error) {
            if (error.message.includes('unique_user_title')) {
                showErrorMessage('Falha ao Salvar: Você já possui um texto com este título.');
            } else {
                showErrorMessage(`Falha ao Salvar: ${error.message}`);
            }
        } else {
            const successMsg = isEditing ? 'Texto atualizado com sucesso!' : 'Texto criado com sucesso!';
            openSuccessModal(successMsg);
        }
        
        saveButton.disabled = false;
        saveButton.textContent = 'Salvar';
    });

    backButton.addEventListener('click', () => window.location.href = '/manage.html');
    goToManageBtn.addEventListener('click', () => window.location.href = '/manage.html');
    createAnotherBtn.addEventListener('click', () => {
        if(isEditing) {
            window.location.href = '/manage.html';
        } else {
            closeSuccessModal();
            form.reset();
            titleInput.focus();
        }
    });
}
document.addEventListener('DOMContentLoaded', initializeEditPage);