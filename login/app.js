/**
 * Secure Portal - Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. STATE & STORAGE MANAGEMENT
    // ==========================================
    const DEFAULT_USER = {
        email: 'admin@example.com',
        password: 'password123'
    };

    // Initialize mock database in localStorage
    function initDatabase() {
        if (!localStorage.getItem('portal_users')) {
            localStorage.setItem('portal_users', JSON.stringify([DEFAULT_USER]));
        }
    }

    // Retrieve users list
    function getUsers() {
        return JSON.parse(localStorage.getItem('portal_users') || '[]');
    }

    // Save users list
    function saveUsers(users) {
        localStorage.setItem('portal_users', JSON.stringify(users));
    }

    // Check active session
    function checkSession() {
        const activeSession = localStorage.getItem('portal_session');
        if (activeSession) {
            showDashboard(activeSession);
        } else {
            showSection('login-section');
        }
    }

    // ==========================================
    // 2. DOM SELECTIONS
    // ==========================================
    const sections = {
        login: document.getElementById('login-section'),
        forgot: document.getElementById('forgot-section'),
        dashboard: document.getElementById('dashboard-section')
    };

    // Forms
    const loginForm = document.getElementById('login-form');
    const forgotEmailForm = document.getElementById('forgot-email-form');
    const forgotResetForm = document.getElementById('forgot-reset-form');

    // Toggle password buttons
    const toggleLoginPassBtn = document.getElementById('toggle-login-password');
    const toggleResetPassBtn = document.getElementById('toggle-reset-password');

    // Password Inputs
    const loginPasswordInput = document.getElementById('login-password');
    const resetPasswordInput = document.getElementById('reset-password');

    // Navigation buttons
    const triggerForgotBtn = document.getElementById('trigger-forgot');
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Dashboard Info
    const sessionEmailSpan = document.getElementById('session-email');
    const sessionTimeSpan = document.getElementById('session-time');
    const dashboardAvatar = document.getElementById('dashboard-avatar');
    const dashboardTitle = document.getElementById('dashboard-title');

    // Toast container
    const toastContainer = document.getElementById('toast-container');

    // Local Verification Memory
    let pendingResetEmail = '';
    let generatedResetCode = '';

    // ==========================================
    // 3. TOAST COMPONENT HELPERS
    // ==========================================
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconSvg = type === 'success' 
            ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

        toast.innerHTML = `
            ${iconSvg}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'toast-out 0.3s ease forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    }

    // ==========================================
    // 4. NAVIGATION & VISUAL FLOW CONTROLLERS
    // ==========================================
    function showSection(sectionId) {
        Object.keys(sections).forEach(key => {
            if (sections[key].id === sectionId) {
                sections[key].classList.remove('hidden');
            } else {
                sections[key].classList.add('hidden');
            }
        });
    }

    function showDashboard(email) {
        sessionEmailSpan.textContent = email;
        
        // Create initial avatar letter
        const firstLetter = email.charAt(0).toUpperCase();
        dashboardAvatar.textContent = firstLetter;
        
        // Display personalized title
        const username = email.split('@')[0];
        dashboardTitle.textContent = `Welcome, ${username}!`;

        // Update login time
        const now = new Date();
        sessionTimeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + now.toLocaleDateString();
        
        showSection('dashboard-section');
    }

    // Reset Forgot Password Step UI states
    function resetForgotFlow() {
        forgotEmailForm.classList.remove('hidden');
        forgotResetForm.classList.add('hidden');
        document.getElementById('forgot-title').textContent = 'Forgot Password?';
        document.getElementById('forgot-subtitle').textContent = 'Enter your email address to receive a verification code';
        
        // Clear inputs and errors
        forgotEmailForm.reset();
        forgotResetForm.reset();
        clearError(document.getElementById('forgot-email'));
        clearError(document.getElementById('reset-code'));
        clearError(document.getElementById('reset-password'));
        
        pendingResetEmail = '';
        generatedResetCode = '';
    }

    // ==========================================
    // 5. FORM FIELD VALIDATIONS
    // ==========================================
    function getValidationError(input) {
        if (input.validity.valueMissing) {
            return 'This field is required.';
        }
        if (input.validity.typeMismatch && input.type === 'email') {
            return 'Please enter a valid email address.';
        }
        if (input.validity.tooShort) {
            return `Must be at least ${input.minLength} characters (currently ${input.value.length}).`;
        }
        if (input.validity.patternMismatch && input.id === 'reset-code') {
            return 'Verification code must be exactly 6 digits.';
        }
        return '';
    }

    function showError(input, message) {
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (errorSpan) {
            errorSpan.textContent = message;
            input.setAttribute('aria-invalid', 'true');
            input.classList.add('input-invalid');
        }
    }

    function clearError(input) {
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (errorSpan) {
            errorSpan.textContent = '';
            input.removeAttribute('aria-invalid');
            input.classList.remove('input-invalid');
        }
    }

    function validateField(input) {
        const errorMessage = getValidationError(input);
        if (errorMessage) {
            showError(input, errorMessage);
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // Register Validation Listeners
    const fieldsToValidate = [
        document.getElementById('login-email'),
        loginPasswordInput,
        document.getElementById('forgot-email'),
        document.getElementById('reset-code'),
        resetPasswordInput
    ];

    fieldsToValidate.forEach(input => {
        if (!input) return;
        
        // Validate on blur when user exits input
        input.addEventListener('blur', () => {
            validateField(input);
        });

        // Clear error dynamically as the user types
        input.addEventListener('input', () => {
            if (input.classList.contains('input-invalid')) {
                // Perform light validation to clear if resolved
                const error = getValidationError(input);
                if (!error) {
                    clearError(input);
                } else {
                    // Update error text in real-time
                    const errorSpan = document.getElementById(`${input.id}-error`);
                    if (errorSpan) errorSpan.textContent = error;
                }
            }
        });
    });

    // ==========================================
    // 6. EVENT BINDINGS: TRIGGERS & PASSWORD TOGGLES
    // ==========================================
    
    // Toggle Password Masking Helper
    function setupPasswordToggle(toggleBtn, passwordInput) {
        if (!toggleBtn || !passwordInput) return;
        
        toggleBtn.addEventListener('click', () => {
            const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
            
            if (isPressed) {
                passwordInput.type = 'password';
                toggleBtn.setAttribute('aria-pressed', 'false');
                toggleBtn.setAttribute('aria-label', 'Show password');
                toggleBtn.innerHTML = `
                    <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            } else {
                passwordInput.type = 'text';
                toggleBtn.setAttribute('aria-pressed', 'true');
                toggleBtn.setAttribute('aria-label', 'Hide password');
                toggleBtn.innerHTML = `
                    <svg class="icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                `;
            }
        });
    }

    setupPasswordToggle(toggleLoginPassBtn, loginPasswordInput);
    setupPasswordToggle(toggleResetPassBtn, resetPasswordInput);

    // Section Switching Links
    triggerForgotBtn.addEventListener('click', () => {
        resetForgotFlow();
        showSection('forgot-section');
    });

    backToLoginBtn.addEventListener('click', () => {
        showSection('login-section');
    });

    // ==========================================
    // 7. LOGIN SUBMISSION
    // ==========================================
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('login-email');
        const submitBtn = document.getElementById('login-submit-btn');
        
        // Run full form validation
        const isEmailValid = validateField(emailInput);
        const isPasswordValid = validateField(loginPasswordInput);
        
        if (!isEmailValid || !isPasswordValid) {
            showToast('Please correct form errors.', 'error');
            return;
        }

        // Disable button to prevent double submit animation
        submitBtn.disabled = true;
        
        const emailValue = emailInput.value.trim().toLowerCase();
        const passwordValue = loginPasswordInput.value;

        // Simulate short latency
        setTimeout(() => {
            const users = getUsers();
            const user = users.find(u => u.email === emailValue);

            if (user && user.password === passwordValue) {
                // Save session
                localStorage.setItem('portal_session', user.email);
                showDashboard(user.email);
                showToast('Signed in successfully!', 'success');
                loginForm.reset();
            } else {
                showToast('Invalid email or password.', 'error');
                showError(loginPasswordInput, 'Please double-check your credentials.');
            }
            submitBtn.disabled = false;
        }, 800);
    });

    // ==========================================
    // 8. FORGOT PASSWORD SUBMISSIONS
    // ==========================================
    forgotEmailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('forgot-email');
        const isEmailValid = validateField(emailInput);
        
        if (!isEmailValid) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        const emailValue = emailInput.value.trim().toLowerCase();
        const users = getUsers();
        const userExists = users.some(u => u.email === emailValue);

        if (!userExists) {
            showError(emailInput, 'No account matches this email address.');
            showToast('Account not found.', 'error');
            return;
        }

        // Simulating sending the code
        pendingResetEmail = emailValue;
        generatedResetCode = Math.floor(100000 + Math.random() * 900000).toString();

        showToast(`Simulated Code Sent! Code is: ${generatedResetCode}`, 'success');
        console.log(`[SIMULATION] Reset code for ${emailValue}: ${generatedResetCode}`);

        // Update headers to Step 2
        document.getElementById('forgot-title').textContent = 'Enter Security Code';
        document.getElementById('forgot-subtitle').textContent = `We sent a 6-digit code to ${emailValue}`;

        // Swap Forms inside the Card
        forgotEmailForm.classList.add('hidden');
        forgotResetForm.classList.remove('hidden');
    });

    forgotResetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const codeInput = document.getElementById('reset-code');
        const isCodeValid = validateField(codeInput);
        const isPasswordValid = validateField(resetPasswordInput);

        if (!isCodeValid || !isPasswordValid) {
            showToast('Please correct form errors.', 'error');
            return;
        }

        const enteredCode = codeInput.value.trim();
        const newPassword = resetPasswordInput.value;

        if (enteredCode !== generatedResetCode) {
            showError(codeInput, 'Invalid security code. Please check console if missed.');
            showToast('Invalid code.', 'error');
            return;
        }

        // Update mock db
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === pendingResetEmail);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            saveUsers(users);
            
            showToast('Password updated successfully!', 'success');
            showSection('login-section');
            resetForgotFlow();
        } else {
            showToast('An error occurred. Please try again.', 'error');
            resetForgotFlow();
            showSection('login-section');
        }
    });

    // ==========================================
    // 9. LOGOUT SUBMISSION
    // ==========================================
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('portal_session');
        showSection('login-section');
        showToast('Logged out successfully.', 'success');
    });

    // ==========================================
    // 9. INIT APP
    // ==========================================
    initDatabase();
    checkSession();
});
