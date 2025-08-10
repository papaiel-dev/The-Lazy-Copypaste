function initializeDashboard() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeDashboard, 100);
        return;
    }

    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    // Como o servidor já validou a sessão, podemos pegar o usuário com segurança
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
    
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    });
}

document.addEventListener('DOMContentLoaded', initializeDashboard);