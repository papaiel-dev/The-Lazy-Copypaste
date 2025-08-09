document.addEventListener('DOMContentLoaded', async () => {
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    try {
        // Busca os dados do usuário logado na nova API
        const response = await fetch('/api/users/me');
        if (!response.ok) throw new Error('Usuário não autenticado');

        const user = await response.json();
        
        // Exibe as informações do usuário e o botão de logout
        userEmailSpan.textContent = `Olá, ${user.email}`;
        userInfoDiv.style.display = 'flex';
        userInfoDiv.style.alignItems = 'center';
        userInfoDiv.style.gap = '15px';

    } catch (error) {
        // Se falhar (ex: token expirou), redireciona para a página inicial
        console.error(error);
        window.location.href = '/';
    }

    // Adiciona a funcionalidade de logout ao botão
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/api/users/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    });
});