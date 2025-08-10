function initializeLandingPage() {
    if (typeof supabase === 'undefined') {
        setTimeout(initializeLandingPage, 100);
        return;
    }
    
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const authModalCloseBtn = authModal.querySelector('.modal-close');
    const modalTabs = authModal.querySelector('.modal-tabs');
    const loginTab = authModal.querySelector('#login-tab');
    const registerTab = authModal.querySelector('#register-tab');
    const authStatusMessage = authModal.querySelector('#modal-status-message');
    const actionButtons = document.querySelectorAll('[data-action]');
    
    const recoveryModal = document.getElementById('recovery-modal');
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryModalCloseBtn = recoveryModal.querySelector('.modal-close');
    const recoveryStatusMessage = recoveryModal.querySelector('#recovery-status-message');
    const recoveryStep1 = recoveryModal.querySelector('#recovery-step-1');
    const recoveryStep2 = recoveryModal.querySelector('#recovery-step-2');

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

    const openAuthModal = (defaultTab = 'login') => { authModal.style.display = 'flex'; switchTab(defaultTab); };
    const closeAuthModal = () => { authModal.style.display = 'none'; authStatusMessage.style.display = 'none'; };
    const openRecoveryModal = () => {
        closeAuthModal();
        recoveryStep1.style.display = 'block';
        recoveryStep2.style.display = 'none';
        recoveryForm.reset();
        recoveryStatusMessage.style.display = 'none';
        recoveryModal.style.display = 'flex';
    };
    const closeRecoveryModal = () => { recoveryModal.style.display = 'none'; };
    const switchTab = (tabName) => {
        modalTabs.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
        modalTabs.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        loginTab.style.display = tabName === 'login' ? 'block' : 'none';
        registerTab.style.display = tabName === 'register' ? 'block' : 'none';
    };
    const showStatusMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.className = isError ? 'status-message error' : 'status-message success';
        element.style.display = 'block';
    };
    
    actionButtons.forEach(button => button.addEventListener('click', () => openAuthModal(button.getAttribute('data-action'))));
    authModalCloseBtn.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuthModal(); });
    modalTabs.addEventListener('click', (e) => { if (e.target.matches('.tab-link')) switchTab(e.target.getAttribute('data-tab')); });
    
    forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); openRecoveryModal(); });
    recoveryModalCloseBtn.addEventListener('click', closeRecoveryModal);
    recoveryModal.addEventListener('click', (e) => { if (e.target === recoveryModal) closeRecoveryModal(); });

    recoveryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('recovery-email').value;
        const submitButton = recoveryForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password.html` });
        if (error) {
            showStatusMessage(recoveryStatusMessage, `Erro: ${error.message}`, true);
        } else {
            recoveryStep1.style.display = 'none';
            recoveryStep2.querySelector('p').textContent = `Link de redefinição enviado com sucesso para ${email}! Verifique sua caixa de entrada e spam.`;
            recoveryStep2.style.display = 'block';
            recoveryStatusMessage.style.display = 'none';
        }
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Link';
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) showStatusMessage(authStatusMessage, error.message, true);
        else window.location.href = '/dashboard.html';
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        if (password !== confirmPassword) {
            showStatusMessage(authStatusMessage, 'As senhas não coincidem.', true);
            return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) showStatusMessage(authStatusMessage, error.message, true);
        else {
            showStatusMessage(authStatusMessage, 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
            switchTab('login');
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeLandingPage);