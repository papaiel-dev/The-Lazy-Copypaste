function initializeDashboard() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeDashboard, 100);
        return;
    }

    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error || !session) {
            console.error('Sessão não encontrada no frontend, redirecionando...');
            window.location.href = '/';
            return;
        }
        const user = session.user;
        const displayName = user.user_metadata.name || user.email;
        userEmailSpan.textContent = `Olá, ${displayName}`;
        userInfoDiv.style.display = 'flex';
        userInfoDiv.style.alignItems = 'center';
        userInfoDiv.style.gap = '15px';
    });
    
    // --- LÓGICA DE LOGOUT ATUALIZADA ---
    logoutBtn.addEventListener('click', async () => {
        // 1. Desloga a sessão no Supabase (no lado do cliente)
        await supabase.auth.signOut();
        
        // 2. Chama nossa API no servidor para limpar os cookies
        await fetch('/api/logout', { method: 'POST' });
        
        // 3. Redireciona para a página inicial
        window.location.href = '/';
    });
}

document.addEventListener('DOMContentLoaded', initializeDashboard);