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
    const statusMessage = document.getElementById('status-message');
    
    let currentUser = null;

    const showStatusMessage = (message, isError = false) => {
        statusMessage.textContent = message;
        statusMessage.className = isError ? 'status-message error' : 'status-message success';
        statusMessage.style.display = 'block';
        setTimeout(() => { statusMessage.style.display = 'none'; }, 4000);
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
        const { data, error } = await supabase.auth.updateUser({
            data: { name: userNameInput.value.trim() }
        });
        if (error) {
            showStatusMessage(`Erro ao atualizar nome: ${error.message}`, true);
        } else {
            showStatusMessage('Nome atualizado com sucesso!');
        }
    });

    updatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (newPasswordInput.value.length < 6) {
            return showStatusMessage('A nova senha deve ter no mínimo 6 caracteres.', true);
        }
        const { data, error } = await supabase.auth.updateUser({
            password: newPasswordInput.value
        });
        if (error) {
            showStatusMessage(`Erro ao atualizar senha: ${error.message}`, true);
        } else {
            showStatusMessage('Senha atualizada com sucesso!');
            newPasswordInput.value = '';
        }
    });

    deleteAccountBtn.addEventListener('click', async () => {
        if (!currentUser) return;
        
        const confirmation = prompt(`AÇÃO IRREVERSÍVEL!\n\nIsto irá deletar permanentemente sua conta e todos os seus textos. Para confirmar, digite seu e-mail: ${currentUser.email}`);
        
        if (confirmation === currentUser.email) {
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

                if (!response.ok) {
                    throw new Error(result.error || 'Falha ao deletar a conta.');
                }

                alert("Conta deletada com sucesso. Você será desconectado.");
                await supabase.auth.signOut();
                window.location.href = '/';

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        } else if (confirmation !== null) {
            alert("A confirmação falhou. Sua conta não foi deletada.");
        }
    });
}
document.addEventListener('DOMContentLoaded', initializeAccountPage);