function initializeAccountPage() {
    if (typeof supabase === 'undefined') {
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
    const statusMessage = document.getElementById('status-message');
    
    // Elementos do modal de exclusão
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

    // Carrega dados do usuário
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            currentUser = user;
            userNameInput.value = user.user_metadata.name || '';
        } else {
            window.location.href = '/';
        }
    });

    // Atualizar nome (sem alterações)
    updateNameForm.addEventListener('submit', async (e) => { /* ... */ });

    // Atualizar senha (sem alterações)
    updatePasswordForm.addEventListener('submit', async (e) => { /* ... */ });

    // --- NOVA LÓGICA DE EXCLUSÃO DE CONTA ---

    // 1. Botão principal agora apenas abre o modal
    deleteAccountBtn.addEventListener('click', () => {
        deletePasswordInput.value = '';
        deleteStatusMessage.style.display = 'none';
        deleteConfirmModal.style.display = 'flex';
    });

    // 2. Botões de controle do modal
    cancelDeleteBtn.addEventListener('click', () => {
        deleteConfirmModal.style.display = 'none';
    });
    deleteConfirmModal.querySelector('.modal-close').addEventListener('click', () => {
        deleteConfirmModal.style.display = 'none';
    });

    // 3. Lógica de submissão do formulário DENTRO do modal
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

        // Passo A: Reautenticar o usuário com a senha fornecida
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

        // Passo B: Se a senha estiver correta, prosseguir com a exclusão
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
// Cole o corpo completo das funções omitidas aqui para garantir
document.addEventListener('DOMContentLoaded', initializeAccountPage);