function initializeLandingPage() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeLandingPage, 100);
        return;
    }

    const modal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalCloseBtn = modal.querySelector('.modal-close');
    const modalTabs = modal.querySelector('.modal-tabs');
    const loginTab = modal.querySelector('#login-tab');
    const registerTab = modal.querySelector('#register-tab');
    const statusMessage = modal.querySelector('#modal-status-message');
    const actionButtons = document.querySelectorAll('[data-action]');
    
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

    const openModal = (defaultTab = 'login') => { modal.style.display = 'flex'; switchTab(defaultTab); };
    const closeModal = () => { modal.style.display = 'none'; statusMessage.style.display = 'none'; };
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
    
    actionButtons.forEach(button => button.addEventListener('click', () => openModal(button.getAttribute('data-action'))));
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modalTabs.addEventListener('click', (e) => { if (e.target.matches('.tab-link')) switchTab(e.target.getAttribute('data-tab')); });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) showStatusMessage(error.message, true);
        else window.location.href = '/dashboard.html';
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        if (password !== confirmPassword) {
            showStatusMessage('As senhas não coincidem.', true);
            return;
        }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) showStatusMessage(error.message, true);
        else {
            showStatusMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta e depois faça o login.');
            switchTab('login');
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeLandingPage);