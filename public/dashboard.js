function initializeDashboard() {
    if (typeof supabase === 'undefined' || !supabase) {
        setTimeout(initializeDashboard, 100);
        return;
    }

    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    supabase.auth.onAuthStateChange((event, session) => {
        if (!session) {
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
    });
}

document.addEventListener('DOMContentLoaded', initializeDashboard);