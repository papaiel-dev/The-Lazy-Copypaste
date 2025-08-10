function initializeDashboard() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeDashboard, 100);
        return;
    }

    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (error || !user) {
            console.error('Nenhum usuário logado, redirecionando...');
            window.location.href = '/';
            return;
        }

        userEmailSpan.textContent = `Olá, ${user.email}`;
        userInfoDiv.style.display = 'flex';
        userInfoDiv.style.alignItems = 'center';
        userInfoDiv.style.gap = '15px';
    });
    
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erro ao fazer logout:', error);
        }
        // Independentemente de erro, redireciona para a home
        window.location.href = '/';
    });
}

document.addEventListener('DOMContentLoaded', initializeDashboard);