// ===================================
// Login Page JavaScript
// ===================================

// DOM Elements
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const successModal = document.getElementById('success-modal');
const modalClose = document.getElementById('modal-close');
const passwordToggles = document.querySelectorAll('.toggle-password');
const signupPasswordInput = document.getElementById('signup-password');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

// ===================================
// Tab Switching
// ===================================
function switchTab(tabName) {
    // Update tab buttons
    if (tabName === 'login') {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

loginTab.addEventListener('click', () => switchTab('login'));
signupTab.addEventListener('click', () => switchTab('signup'));

// ===================================
// Password Toggle Visibility
// ===================================
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        const icon = toggle.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// ===================================
// Password Strength Checker
// ===================================
function checkPasswordStrength(password) {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return strength;
}

function updatePasswordStrength(password) {
    const strength = checkPasswordStrength(password);

    // Remove all strength classes
    strengthFill.classList.remove('weak', 'medium', 'strong');

    if (password.length === 0) {
        strengthFill.style.width = '0';
        strengthText.textContent = 'Password strength';
        strengthText.style.color = 'var(--color-text-tertiary)';
    } else if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak password';
        strengthText.style.color = '#ff4444';
    } else if (strength <= 4) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Medium password';
        strengthText.style.color = '#ffaa00';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong password';
        strengthText.style.color = 'var(--color-primary)';
    }
}

if (signupPasswordInput) {
    signupPasswordInput.addEventListener('input', (e) => {
        updatePasswordStrength(e.target.value);
    });
}

// ===================================
// Form Validation
// ===================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ===================================
// Login Form Submission
// ===================================
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Validate email
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Validate password
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // Simulate login process
    showLoading(e.target.querySelector('button[type="submit"]'));

    setTimeout(() => {
        // In production, this would be an API call
        console.log('Login attempt:', { email, password, rememberMe });

        // Create user object
        const user = {
            name: email.split('@')[0],
            email: email,
            picture: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=00d084&color=fff&size=128`,
            provider: 'email'
        };

        // Store user data in localStorage
        localStorage.setItem('cricketpro_user', JSON.stringify(user));

        // Show success modal
        showSuccessModal('You have successfully logged in!');

        // Reset form
        loginForm.reset();
        hideLoading(e.target.querySelector('button[type="submit"]'));

        // Redirect to homepage
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
});

// ===================================
// Signup Form Submission
// ===================================
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAgree = document.getElementById('terms-agree').checked;

    // Validate email
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Validate phone
    if (!validatePhone(phone)) {
        showError('Please enter a valid phone number');
        return;
    }

    // Validate password strength
    const strength = checkPasswordStrength(password);
    if (strength < 3) {
        showError('Please choose a stronger password');
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    // Validate terms agreement
    if (!termsAgree) {
        showError('Please agree to the Terms & Conditions');
        return;
    }

    // Simulate signup process
    showLoading(e.target.querySelector('button[type="submit"]'));

    setTimeout(() => {
        // In production, this would be an API call
        console.log('Signup attempt:', { firstName, lastName, email, phone, password });

        // Show success modal
        showSuccessModal('Account created successfully! Welcome to CricketPro!');

        // Reset form
        signupForm.reset();
        updatePasswordStrength('');
        hideLoading(e.target.querySelector('button[type="submit"]'));
    }, 2000);
});

// ===================================
// Social Login Buttons
// ===================================
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const provider = btn.classList.contains('google-btn') ? 'Google' : 'Facebook';

        // Simulate OAuth flow with frontend-only implementation
        if (provider === 'Google') {
            const googleUser = {
                name: 'Demo User',
                email: 'demo@gmail.com',
                picture: 'https://ui-avatars.com/api/?name=Demo+User&background=00d084&color=fff&size=128',
                provider: 'google'
            };

            localStorage.setItem('cricketpro_user', JSON.stringify(googleUser));
            showSuccessModal(`Welcome ${googleUser.name}! You've successfully logged in with Google.`);

            setTimeout(() => {
                window.location.href = 'index1.html';
            }, 2000);
        } else {
            const facebookUser = {
                name: 'Facebook User',
                email: 'user@facebook.com',
                picture: 'https://ui-avatars.com/api/?name=Facebook+User&background=4267B2&color=fff&size=128',
                provider: 'facebook'
            };

            localStorage.setItem('cricketpro_user', JSON.stringify(facebookUser));
            showSuccessModal(`Welcome ${facebookUser.name}! You've successfully logged in with Facebook.`);

            setTimeout(() => {
                window.location.href = 'index1.html';
            }, 2000);
        }
    });
});

// ===================================
// Success Modal
// ===================================
function showSuccessModal(message) {
    document.getElementById('modal-message').textContent = message;
    successModal.classList.add('active');
}

function hideSuccessModal() {
    successModal.classList.remove('active');
}

modalClose.addEventListener('click', () => {
    hideSuccessModal();
    // Redirect to homepage
    window.location.href = 'index1.html';
});

// Close modal on overlay click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        hideSuccessModal();
    }
});

// ===================================
// Error Handling
// ===================================
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(errorDiv);

    // Trigger animation
    setTimeout(() => {
        errorDiv.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 3000);
}

// Add error notification styles
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .error-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        z-index: 10000;
        font-weight: 600;
    }
    
    .error-notification.show {
        transform: translateX(0);
    }
    
    .error-notification i {
        font-size: 1.25rem;
    }
`;
document.head.appendChild(errorStyles);

// ===================================
// Loading State
// ===================================
function showLoading(button) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
}

function hideLoading(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
}

// ===================================
// Forgot Password
// ===================================
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();

    const email = prompt('Please enter your email address to reset your password:');

    if (email && validateEmail(email)) {
        showError('Password reset link has been sent to your email!');
        console.log('Password reset requested for:', email);
    } else if (email) {
        showError('Please enter a valid email address');
    }
});

// ===================================
// Keyboard Shortcuts
// ===================================
document.addEventListener('keydown', (e) => {
    // Close modal with Escape
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        hideSuccessModal();
    }

    // Switch tabs with Alt+1 and Alt+2
    if (e.altKey && e.key === '1') {
        switchTab('login');
    } else if (e.altKey && e.key === '2') {
        switchTab('signup');
    }
});

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Login Page Loaded Successfully!');
    console.log('Features: Login ✓ | Signup ✓ | Password Strength ✓ | Validation ✓');
});
