document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('mobile-active');
        });
    });

    document.addEventListener('click', (e) => {
        if (navContainer && !navContainer.contains(e.target) && navLinks.classList.contains('mobile-active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('mobile-active');
        }
    });
});