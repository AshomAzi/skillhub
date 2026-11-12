document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#signup-form');
    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#confirm-password');
    const strengthMeter = document.querySelector('#strength-meter');
    const strengthLabel = document.querySelector('#strength-label');
    const status = document.querySelector('#signup-status');

    document.querySelectorAll('[data-password-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const input = document.getElementById(button.dataset.passwordToggle);
            if (!input) return;

            const isVisible = input.type === 'text';
            input.type = isVisible ? 'password' : 'text';
            button.setAttribute('aria-pressed', String(!isVisible));
            button.setAttribute('aria-label', `${isVisible ? 'Show' : 'Hide'} ${input.id === 'password' ? 'password' : 'confirm password'}`);
        });
    });

    if (!form || !password || !confirmPassword || !strengthMeter || !strengthLabel || !status) return;

    const updatePasswordMatch = () => {
        confirmPassword.setCustomValidity(
            confirmPassword.value && confirmPassword.value !== password.value ? 'Passwords do not match.' : ''
        );
    };

    const updatePasswordStrength = () => {
        const value = password.value;
        const strength = [
            value.length >= 8,
            /[a-z]/.test(value) && /[A-Z]/.test(value),
            /\d/.test(value),
            /[^A-Za-z0-9]/.test(value)
        ].filter(Boolean).length;
        const labels = ['Use at least 8 characters.', 'Weak password', 'Fair password', 'Good password', 'Strong password'];

        strengthMeter.dataset.strength = String(strength);
        strengthLabel.textContent = value ? labels[strength] : labels[0];
    };

    password.addEventListener('input', () => {
        updatePasswordStrength();
        updatePasswordMatch();
    });
    confirmPassword.addEventListener('input', updatePasswordMatch);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        status.textContent = 'Your details are valid. Connect this form to Django to create the account.';
        status.hidden = false;
    });

    updatePasswordStrength();
});
