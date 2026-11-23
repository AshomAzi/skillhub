document.addEventListener('DOMContentLoaded', () => {
    const memberHeader = document.querySelector('#member-header');
    const guestHeader = document.querySelector('.navbar:not(.member-navbar)');
    const profileMenu = document.querySelector('.profile-menu');
    const profileTrigger = document.querySelector('.profile-menu-trigger');
    const profileMenuList = document.querySelector('#profile-menu-list');

    const storedAuth = localStorage.getItem('skillhub-signed-in');
    const isAuthenticated = storedAuth !== null
        ? storedAuth === 'true'
        : document.body.dataset.authenticated === 'true';

    const setHeaderState = (authenticated) => {
        if (memberHeader) {
            memberHeader.hidden = !authenticated;
        }
        if (guestHeader) {
            guestHeader.hidden = authenticated;
            guestHeader.querySelectorAll('.nav-actions').forEach((guestActions) => {
                guestActions.hidden = authenticated;
            });
        }
    };

    setHeaderState(isAuthenticated);

    if (profileTrigger && profileMenu && profileMenuList) {
        const closeProfileMenu = () => {
            profileMenuList.hidden = true;
            profileTrigger.setAttribute('aria-expanded', 'false');
        };

        profileTrigger.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = profileMenuList.hidden;
            profileMenuList.hidden = !isOpen;
            profileTrigger.setAttribute('aria-expanded', String(isOpen));
        });

        profileMenuList.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeProfileMenu);
        });

        document.addEventListener('click', (event) => {
            if (!profileMenu.contains(event.target)) {
                closeProfileMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeProfileMenu();
                profileTrigger.focus();
            }
        });

        const logoutButton = profileMenuList.querySelector('.profile-menu-logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.setItem('skillhub-signed-in', 'false');
                document.body.dataset.authenticated = 'false';
                setHeaderState(false);
                closeProfileMenu();
            });
        }
    }

    const themeToggles = document.querySelectorAll('.theme-toggle');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeToggles.length) {
        const updateTheme = (theme) => {
            const isDark = theme === 'dark';
            const nextMode = isDark ? 'light' : 'dark';

            document.documentElement.dataset.theme = theme;
            themeToggles.forEach((themeToggle) => {
                themeToggle.setAttribute('aria-pressed', String(isDark));
                themeToggle.setAttribute('aria-label', `Switch to ${nextMode} theme`);
                themeToggle.title = `Switch to ${nextMode} theme`;
            });

            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', isDark ? '#101813' : '#ebf1e4');
            }
        };

        updateTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

        themeToggles.forEach((themeToggle) => {
            themeToggle.addEventListener('click', () => {
                const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
                updateTheme(nextTheme);
                localStorage.setItem('skillhub-theme', nextTheme);
            });
        });
    }

    document.querySelectorAll('.navbar').forEach((navContainer) => {
        const hamburger = navContainer.querySelector('.hamburger-btn');
        const navLinks = navContainer.querySelector('.nav-links');
        if (!hamburger || !navLinks) return;

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
    });

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

    const servicesGrid = document.querySelector('#services-grid');
    const serviceDetailDialog = document.querySelector('#service-detail-dialog');

    if (servicesGrid && serviceDetailDialog) {
        const serviceReportDialog = document.querySelector('#service-report-dialog');
        const serviceReportForm = document.querySelector('#service-report-form');
        const reportServiceTitle = document.querySelector('#report-service-title');
        const reportReason = document.querySelector('#report-reason');
        const reportDetails = document.querySelector('#report-details');
        const reportStatus = document.querySelector('#service-report-status');
        const openReportButton = document.querySelector('#open-service-report');
        const detailImage = document.querySelector('#service-detail-image');
        const detailCategory = document.querySelector('#service-detail-category');
        const detailTitle = document.querySelector('#service-detail-title');
        const detailDescription = document.querySelector('#service-detail-description');
        const detailPrice = document.querySelector('#service-detail-price');
        const providerAvatar = document.querySelector('#provider-profile-avatar');
        const providerName = document.querySelector('#provider-profile-name');
        const providerRole = document.querySelector('#provider-profile-role');
        const providerBio = document.querySelector('#provider-profile-bio');
        let reportableService = null;

        servicesGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.service-card');
            if (!card || event.target.closest('.favorite-btn')) return;

            event.preventDefault();
            const title = card.querySelector('.service-title')?.textContent.trim() || 'Service details';
            const category = card.dataset.category || '';
            const categoryLabel = category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : 'Service';
            const ownerInfo = card.querySelector('.owner-info');
            const ownerAvatar = ownerInfo?.querySelector('.owner-avatar');
            const image = card.querySelector('.card-img-wrapper img');
            const provider = ownerInfo?.querySelector('.owner-name')?.textContent.trim() || 'SkillHub provider';

            reportableService = title;

            detailImage.src = image?.src || '';
            detailImage.alt = image?.alt || '';
            detailCategory.textContent = categoryLabel;
            detailTitle.textContent = title;
            detailDescription.textContent = card.dataset.description || 'More service details will be shared soon.';
            detailPrice.textContent = card.querySelector('.price-tag')?.textContent.trim() || 'Price available on request';
            providerAvatar.textContent = ownerAvatar?.textContent.trim() || '';
            providerAvatar.className = `provider-profile-avatar ${ownerAvatar?.className || ''}`;
            providerName.textContent = provider;
            providerRole.textContent = `${categoryLabel} provider`;
            providerBio.textContent = 'This provider has not added a public bio yet.';
            serviceDetailDialog.showModal();
        });

        serviceDetailDialog.querySelector('.service-detail-close').addEventListener('click', () => {
            serviceDetailDialog.close();
        });

        serviceDetailDialog.addEventListener('click', (event) => {
            if (event.target === serviceDetailDialog) {
                serviceDetailDialog.close();
            }
        });

        if (serviceReportDialog && serviceReportForm && reportServiceTitle && reportReason
            && reportDetails && reportStatus && openReportButton) {
            const closeReport = () => {
                serviceReportDialog.close();
                serviceDetailDialog.showModal();
            };

            openReportButton.addEventListener('click', () => {
                reportServiceTitle.textContent = reportableService || 'Selected service';
                reportReason.value = '';
                reportDetails.value = '';
                reportStatus.hidden = true;
                delete reportStatus.dataset.state;
                serviceDetailDialog.close();
                serviceReportDialog.showModal();
                reportReason.focus();
            });

            serviceReportDialog.querySelectorAll('[data-close-report]').forEach((button) => {
                button.addEventListener('click', closeReport);
            });

            serviceReportForm.addEventListener('submit', (event) => {
                event.preventDefault();
                if (!reportableService) {
                    reportStatus.textContent = 'Select a service before submitting a report.';
                    reportStatus.dataset.state = 'error';
                    reportStatus.hidden = false;
                    return;
                }

                reportStatus.textContent = 'This form is not connected yet. Your report was not saved or sent.';
                reportStatus.dataset.state = 'error';
                reportStatus.hidden = false;
            });
        }
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