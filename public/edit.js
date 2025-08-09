document.addEventListener('DOMContentLoaded', async () => {
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

    const pathParts = window.location.pathname.split('/');
    const feedbackId = pathParts[2];
    const isEditing = feedbackId && !isNaN(feedbackId);

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
    const closeSuccessModal = () => {
        successModal.style.display = 'none';
    };

    if (isEditing) {
        pageTitle.textContent = 'Editar Feedback';
        try {
            const response = await fetch(`/api/feedbacks/${feedbackId}`);
            if (!response.ok) throw new Error('Feedback não encontrado.');
            const feedback = await response.json();
            titleInput.value = feedback.title;
            textInput.value = feedback.text;
        } catch (error) {
            alert(error.message);
            window.location.href = '/manage.html';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';
        const url = isEditing ? `/api/feedbacks/${feedbackId}` : '/api/feedbacks';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: titleInput.value.trim(),
                    text: textInput.value.trim()
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            
            const successMsg = isEditing ? 'Feedback atualizado com sucesso!' : 'Feedback criado com sucesso!';
            openSuccessModal(successMsg);

        } catch (error) {
            showErrorMessage(`Falha ao Salvar: ${error.message}`);
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = 'Salvar';
        }
    });

    backButton.addEventListener('click', () => window.location.href = '/manage.html');
    goToManageBtn.addEventListener('click', () => window.location.href = '/manage.html');
    createAnotherBtn.addEventListener('click', () => {
        closeSuccessModal();
        form.reset();
        titleInput.focus();
    });
});