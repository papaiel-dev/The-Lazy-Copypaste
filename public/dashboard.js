function initializeDashboard() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeDashboard, 100);
        return;
    }

    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    // --- LÓGICA CORRETA DE AUTENTICAÇÃO ---
    supabase.auth.onAuthStateChange((event, session) => {
        if (!session) {
            // Se não houver sessão (ou após logout), redireciona
            window.location.href = '/';
            return;
        }
        
        // Se houver sessão, preenche os dados
        const user = session.user;
        const displayName = user.user_metadata.name || user.email;
        userEmailSpan.textContent = `Olá, ${displayName}`;
        userInfoDiv.style.display = 'flex';
        userInfoDiv.style.alignItems = 'center';
        userInfoDiv.style.gap = '15px';
    });
    
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        // O onAuthStateChange cuidará do redirecionamento
    });
}
document.addEventListener('DOMContentLoaded', initializeDashboard);