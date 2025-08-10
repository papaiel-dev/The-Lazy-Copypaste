function initializeAccountPage() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeAccountPage, 100);
        return;
    }

    // Elementos do formulário
    const updateNameForm = document.getElementById('updateNameForm');
    const updatePasswordForm = document.getElementById('updatePasswordForm');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const userNameInput = document.getElementById('user-name');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password'); // Novo campo
    const statusMessage = document.getElementById('status-message');
    
    // Elementos do novo modal
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    let currentUser = null;

    const showStatusMessage = (message, isError = false) => {
        statusMessage.textContent = message;
        statusMessage.className = isError ? 'status-message error' : 'status-message success';
        statusMessage.style.display = 'block';
        setTimeout(() => { statusMessage.style.display = 'none'; }, 4000);
    };

    // Carrega os dados do usuário ao abrir a página
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            currentUser = user;
            userNameInput.value = user.user_metadata.name || '';
        } else {
            window.location.href = '/';
        }
    });

    // Formulário para atualizar o nome
    updateNameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.updateUser({
            data: { name: userNameInput.value.trim() }
        });
        if (error) {
            showStatusMessage(`Erro ao atualizar nome: ${error.message}`, true);
        } else {
            showStatusMessage('Nome atualizado com sucesso!');
        }
    });

    // Formulário para atualizar a senha (com validação)
    updatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmNewPasswordInput.value;

        if (newPassword.length < 6) {
            return showStatusMessage('A nova senha deve ter no mínimo 6 caracteres.', true);
        }
        if (newPassword !== confirmPassword) {
            return showStatusMessage('As senhas não coincidem.', true);
        }
        
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) {
            showStatusMessage(`Erro ao atualizar senha: ${error.message}`, true);
        } else {
            showStatusMessage('Senha atualizada com sucesso!');
            newPasswordInput.value = '';
            confirmNewPasswordInput.value = '';
        }
    });

    // Botão "Deletar Minha Conta" agora abre o modal
    deleteAccountBtn.addEventListener('click', () => {
        deleteConfirmModal.style.display = 'flex';
    });

    // Botão "Cancelar" no modal
    cancelDeleteBtn.addEventListener('click', () => {
        deleteConfirmModal.style.display = 'none';
    });

    // Botão "Sim, deletar" no modal (a lógica de exclusão)
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!currentUser) return;
        
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Deletando...';

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Sessão não encontrada, por favor faça login novamente.");

            const response = await fetch('/api/delete-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                }
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