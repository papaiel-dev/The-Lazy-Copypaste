function initializeAccountPage() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeAccountPage, 100);
        return;
    }

    const updateNameForm = document.getElementById('updateNameForm');
    const updatePasswordForm = document.getElementById('updatePasswordForm');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const userNameInput = document.getElementById('user-name');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const statusMessage = document.getElementById('status-message');
    
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const deletePasswordForm = document.getElementById('delete-password-form');
    const deletePasswordInput = document.getElementById('delete-password');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const deleteStatusMessage = document.getElementById('delete-status-message');

    let currentUser = null;

    const showStatusMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.className = isError ? 'status-message error' : 'status-message success';
        element.style.display = 'block';
        setTimeout(() => { element.style.display = 'none'; }, 4000);
    };

    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            currentUser = user;
            userNameInput.value = user.user_metadata.name || '';
        } else {
            window.location.href = '/';
        }
    });

    updateNameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = updateNameForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const { data, error } = await supabase.auth.updateUser({
            data: { name: userNameInput.value.trim() }
        });

        if (error) {
            showStatusMessage(statusMessage, `Erro ao atualizar nome: ${error.message}`, true);
        } else {
            showStatusMessage(statusMessage, 'Nome atualizado com sucesso!');
        }
        
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar Nome';
    });

    updatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = updatePasswordForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmNewPasswordInput.value;

        if (newPassword.length < 6) {
            showStatusMessage(statusMessage, 'A nova senha deve ter no mínimo 6 caracteres.', true);
            submitButton.disabled = false;
            submitButton.textContent = 'Alterar Senha';
            return;
        }
        if (newPassword !== confirmPassword) {
            showStatusMessage(statusMessage, 'As senhas não coincidem.', true);
            submitButton.disabled = false;
            submitButton.textContent = 'Alterar Senha';
            return;
        }
        
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            showStatusMessage(statusMessage, `Erro ao atualizar senha: ${error.message}`, true);
        } else {
            showStatusMessage(statusMessage, 'Senha atualizada com sucesso!');
            newPasswordInput.value = '';
            confirmNewPasswordInput.value = '';
        }

        submitButton.disabled = false;
        submitButton.textContent = 'Alterar Senha';
    });

    deleteAccountBtn.addEventListener('click', () => {
        deletePasswordInput.value = '';
        deleteStatusMessage.style.display = 'none';
        deleteConfirmModal.style.display = 'flex';
    });
    cancelDeleteBtn.addEventListener('click', () => {
        deleteConfirmModal.style.display = 'none';
    });
    deleteConfirmModal.querySelector('.modal-close').addEventListener('click', () => {
        deleteConfirmModal.style.display = 'none';
    });
    deletePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const password = deletePasswordInput.value;
        if (!password) {
            showStatusMessage(deleteStatusMessage, 'Por favor, digite sua senha.', true);
            return;
        }
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Verificando...';
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: currentUser.email,
            password: password,
        });
        if (signInError) {
            showStatusMessage(deleteStatusMessage, 'Senha incorreta. A conta não foi deletada.', true);
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = 'Sim, deletar minha conta';
            return;
        }
        confirmDeleteBtn.textContent = 'Deletando...';
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Sessão não encontrada.");
            const response = await fetch('/api/delete-user', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Falha ao deletar a conta.');
            
            showStatusMessage(statusMessage, "Conta deletada com sucesso. Você será desconectado.");
            setTimeout(async () => {
                await supabase.auth.signOut();
                window.location.href = '/';
            }, 3000);
            deleteConfirmModal.style.display = 'none';
        } catch (error) {
            showStatusMessage(statusMessage, `Erro: ${error.message}`, true);
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = 'Sim, deletar minha conta';
        }
    });
}
document.addEventListener('DOMContentLoaded', initializeAccountPage);