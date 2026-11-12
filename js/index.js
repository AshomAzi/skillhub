document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeToggle) {
        const updateTheme = (theme) => {
            const isDark = theme === 'dark';
            const nextMode = isDark ? 'light' : 'dark';

            document.documentElement.dataset.theme = theme;
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', `Switch to ${nextMode} theme`);
            themeToggle.title = `Switch to ${nextMode} theme`;

            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', isDark ? '#101813' : '#ebf1e4');
            }
        };

        updateTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

        themeToggle.addEventListener('click', () => {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            updateTheme(nextTheme);
            localStorage.setItem('skillhub-theme', nextTheme);
        });
    }

    const hamburger = document.querySelector('.hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.navbar');

    if (hamburger && navLinks) {
        const closeMenu = () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('mobile-active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation menu');
        };

        hamburger.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = hamburger.classList.toggle('active');
            navLinks.classList.toggle('mobile-active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (event) => {
            if (navContainer && !navContainer.contains(event.target) && navLinks.classList.contains('mobile-active')) {
                closeMenu();
            }
        });
    }

    const searchForm = document.querySelector('#service-search');
    const searchInput = document.querySelector('#search-query');
    const categoryButtons = document.querySelectorAll('.cat-btn');
    const priceFilter = document.querySelector('#price-filter');
    const serviceCards = document.querySelectorAll('.service-card');
    const resultsCount = document.querySelector('#results-count');
    const emptyState = document.querySelector('#empty-state');
    const clearFiltersButton = document.querySelector('#clear-filters');

    if (searchForm && searchInput && priceFilter && resultsCount && emptyState) {
        let selectedCategory = 'all';

        const filterServices = () => {
            const query = searchInput.value.trim().toLocaleLowerCase();
            const maxPrice = priceFilter.value === 'all' ? Infinity : Number(priceFilter.value);
            let visibleCount = 0;

            serviceCards.forEach((card) => {
                const matchesQuery = (card.dataset.search || '').toLocaleLowerCase().includes(query);
                const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
                const matchesPrice = Number(card.dataset.price) <= maxPrice;
                const isVisible = matchesQuery && matchesCategory && matchesPrice;

                card.hidden = !isVisible;
                visibleCount += Number(isVisible);
            });

            resultsCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'service' : 'services'}`;
            emptyState.hidden = visibleCount > 0;
        };

        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            filterServices();
            document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
        });

        searchInput.addEventListener('input', filterServices);
        priceFilter.addEventListener('change', filterServices);

        categoryButtons.forEach((button) => {
            button.addEventListener('click', () => {
                selectedCategory = button.dataset.category || 'all';
                categoryButtons.forEach((categoryButton) => {
                    const isActive = categoryButton === button;
                    categoryButton.classList.toggle('active', isActive);
                    categoryButton.setAttribute('aria-pressed', String(isActive));
                });
                filterServices();
            });
        });

        document.querySelectorAll('[data-search-term]').forEach((button) => {
            button.addEventListener('click', () => {
                searchInput.value = button.dataset.searchTerm || '';
                filterServices();
                document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
            });
        });

        if (clearFiltersButton) {
            clearFiltersButton.addEventListener('click', () => {
                searchInput.value = '';
                priceFilter.value = 'all';
                selectedCategory = 'all';
                categoryButtons.forEach((button) => {
                    const isActive = button.dataset.category === 'all';
                    button.classList.toggle('active', isActive);
                    button.setAttribute('aria-pressed', String(isActive));
                });
                filterServices();
                searchInput.focus();
            });
        }

        filterServices();
    }

    document.querySelectorAll('.favorite-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const isSaved = button.getAttribute('aria-pressed') === 'true';
            button.setAttribute('aria-pressed', String(!isSaved));
            button.classList.toggle('active', !isSaved);

            const serviceTitle = button.closest('.service-card')?.querySelector('.service-title')?.textContent.trim();
            button.setAttribute(
                'aria-label',
                `${isSaved ? 'Save' : 'Remove'} ${serviceTitle || 'service'} ${isSaved ? 'to' : 'from'} saved services`
            );
        });
    });
});