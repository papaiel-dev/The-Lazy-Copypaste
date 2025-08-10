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
            window.location.href = '/';
            return;
        }

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