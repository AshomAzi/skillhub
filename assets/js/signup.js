document.addEventListener('DOMContentLoaded', () => {
    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#confirm-password');
    const strengthMeter = document.querySelector('#strength-meter');
    const strengthLabel = document.querySelector('#strength-label');

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

    if (!password || !confirmPassword || !strengthMeter || !strengthLabel) return;

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

    updatePasswordStrength();
});