function initializeAccountPage() {
    // Espera o cliente Supabase estar pronto
    if (typeof supabase === 'undefined' || !supabase) {
        setTimeout(initializeAccountPage, 100);
        return;
    }

    // Elementos do formulário principal
    const updateNameForm = document.getElementById('updateNameForm');
    const updatePasswordForm = document.getElementById('updatePasswordForm');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const userNameInput = document.getElementById('user-name');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    
    // Elementos de status específicos para cada formulário
    const updateNameStatus = document.getElementById('updateNameStatus');
    const updatePasswordStatus = document.getElementById('updatePasswordStatus');
    
    // Elementos do modal de exclusão
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const deletePasswordForm = document.getElementById('delete-password-form');
    const deletePasswordInput = document.getElementById('delete-password');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const deleteStatusMessage = document.getElementById('delete-status-message');

    let currentUser = null;

    // Função genérica para mostrar mensagens de status
    const showStatusMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.className = isError ? 'status-message error' : 'form-status success';
        if (isError) {
             element.classList.add('error');
        } else {
             element.classList.remove('error');
        }
        element.style.display = 'block';
        setTimeout(() => { element.style.display = 'none'; }, 4000);
    };

    // Carrega dados do usuário ao abrir a página
    supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (error || !user) {
            window.location.href = '/';
            return;
        }
        currentUser = user;
        userNameInput.value = user.user_metadata.name || '';
    });

    // Formulário para atualizar o nome
    updateNameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = updateNameForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const { data, error } = await supabase.auth.updateUser({
            data: { name: userNameInput.value.trim() }
        });

        if (error) {
            showStatusMessage(updateNameStatus, `Erro: ${error.message}`, true);
        } else {
            showStatusMessage(updateNameStatus, 'Nome atualizado com sucesso!');
        }
        
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar Nome';
    });

    // Formulário para atualizar a senha
    updatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = updatePasswordForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmNewPasswordInput.value;

        if (newPassword.length < 6) {
            showStatusMessage(updatePasswordStatus, 'A nova senha deve ter no mínimo 6 caracteres.', true);
            submitButton.disabled = false;
            submitButton.textContent = 'Alterar Senha';
            return;
        }
        if (newPassword !== confirmPassword) {
            showStatusMessage(updatePasswordStatus, 'As senhas não coincidem.', true);
            submitButton.disabled = false;
            submitButton.textContent = 'Alterar Senha';
            return;
        }
        
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            showStatusMessage(updatePasswordStatus, `Erro: ${error.message}`, true);
        } else {
            showStatusMessage(updatePasswordStatus, 'Senha atualizada com sucesso!');
            newPasswordInput.value = '';
            confirmNewPasswordInput.value = '';
        }

        submitButton.disabled = false;
        submitButton.textContent = 'Alterar Senha';
    });

    // Lógica de exclusão de conta
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
            
            alert("Conta deletada com sucesso. Você será desconectado.");
            await supabase.auth.signOut();
            window.location.href = '/';
        } catch (error) {
            alert(`Erro: ${error.message}`);
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = 'Sim, deletar minha conta';
        }
    });
}
document.addEventListener('DOMContentLoaded', initializeAccountPage);