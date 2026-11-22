document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#signin-form');
    const password = document.querySelector('#signin-password');
    const status = document.querySelector('#signin-status');

    document.querySelectorAll('[data-password-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const input = document.getElementById(button.dataset.passwordToggle);
            if (!input) return;

            const isVisible = input.type === 'text';
            input.type = isVisible ? 'password' : 'text';
            button.setAttribute('aria-pressed', String(!isVisible));
            button.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
        });
    });

    if (!form || !password || !status) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        status.textContent = 'Your details look good. Sign-in is not enabled in this frontend demo yet.';
        status.hidden = false;
    });
});
