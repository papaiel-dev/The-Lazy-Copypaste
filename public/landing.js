document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    const modalCloseBtn = modal.querySelector('.modal-close');
    const modalTabs = modal.querySelector('.modal-tabs');
    const loginTab = modal.querySelector('#login-tab');
    const registerTab = modal.querySelector('#register-tab');
    const statusMessage = modal.querySelector('#modal-status-message');
    const actionButtons = document.querySelectorAll('[data-action]');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Lógica para o botão de senha do formulário de LOGIN (independente)
    const loginToggle = loginForm.querySelector('.toggle-password-label');
    if (loginToggle) {
        loginToggle.addEventListener('click', () => {
            const passwordInput = loginToggle.closest('.form-group').querySelector('input');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                loginToggle.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                loginToggle.textContent = '👁️';
            }
        });
    }

    // Lógica SINCRONIZADA para os botões de senha do formulário de CADASTRO
    const registerToggles = registerForm.querySelectorAll('.toggle-password-label');
    const registerPasswordInputs = [
        registerForm.querySelector('#register-password'),
        registerForm.querySelector('#register-confirm-password')
    ];
    if (registerToggles.length > 0) {
        registerToggles.forEach(button => {
            button.addEventListener('click', () => {
                const newType = registerPasswordInputs[0].type === 'password' ? 'text' : 'password';
                const newIcon = newType === 'text' ? '🙈' : '👁️';
                registerPasswordInputs.forEach(input => input.type = newType);
                registerToggles.forEach(btn => btn.textContent = newIcon);
            });
        });
    }

    // Funções do Modal
    const openModal = (defaultTab = 'login') => {
        modal.style.display = 'flex';
        switchTab(defaultTab);
    };
    const closeModal = () => {
        modal.style.display = 'none';
        statusMessage.style.display = 'none';
    };
    const switchTab = (tabName) => {
        modalTabs.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
        modalTabs.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        loginTab.style.display = tabName === 'login' ? 'block' : 'none';
        registerTab.style.display = tabName === 'register' ? 'block' : 'none';
    };
    const showStatusMessage = (message, isError = false) => {
        statusMessage.textContent = message;
        statusMessage.className = isError ? 'status-message error' : 'status-message success';
        statusMessage.style.display = 'block';
    };
    
    // Event Listeners
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            openModal(action);
        });
    });
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modalTabs.addEventListener('click', (e) => {
        if (e.target.matches('.tab-link')) {
            switchTab(e.target.getAttribute('data-tab'));
        }
    });

    // Submissão do Formulário de Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            window.location.href = '/dashboard.html';
        } catch (error) {
            showStatusMessage(error.message, true);
        }
    });

    // Submissão do Formulário de Cadastro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        if (password !== confirmPassword) {
            showStatusMessage('As senhas não coincidem.', true);
            return;
        }
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            showStatusMessage('Cadastro realizado! Faça o login para continuar.');
            switchTab('login');
        } catch (error) {
            showStatusMessage(error.message, true);
        }
    });
});