document.addEventListener('DOMContentLoaded', () => {
    const profileKey = 'skillhub-profile';
    const servicesKey = 'skillhub-services';
    const defaultProfile = {
        name: 'Alex Morgan',
        username: 'alexmorgan',
        email: 'alex@example.com',
        phone: '',
        location: '',
        role: '',
        bio: '',
        image: './img/profile-avatar.svg'
    };

    const loadProfile = () => {
        try {
            return { ...defaultProfile, ...JSON.parse(localStorage.getItem(profileKey) || '{}') };
        } catch {
            return { ...defaultProfile };
        }
    };

    const loadServices = () => {
        try {
            const stored = JSON.parse(localStorage.getItem(servicesKey) || 'null');
            return Array.isArray(stored) ? stored : [];
        } catch {
            return [];
        }
    };

    let profile = loadProfile();
    let services = loadServices();

    const profileForm = document.querySelector('#profile-form');
    const profilePreview = document.querySelector('#profile-preview');
    const profileImage = document.querySelector('#profile-image');
    const profileStatus = document.querySelector('#profile-status');
    const serviceDialog = document.querySelector('#service-dialog');
    const serviceForm = document.querySelector('#service-form');
    const serviceGrid = document.querySelector('#service-grid');
    const overviewServiceGrid = document.querySelector('#overview-service-grid');
    const serviceEmpty = document.querySelector('#service-empty');

    const escapeHtml = (value) => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const formatAmount = (amount) => {
        const number = Number(amount);
        const formatted = Number.isFinite(number)
            ? number.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : '0';
        return `₦${formatted}`;
    };

    const saveProfile = () => {
        localStorage.setItem(profileKey, JSON.stringify(profile));
    };

    const saveServices = () => {
        localStorage.setItem(servicesKey, JSON.stringify(services));
    };

    const updateProfileUI = () => {
        const firstName = profile.name.trim().split(/\s+/)[0] || 'there';
        document.querySelector('#overview-name').textContent = firstName;
        document.querySelector('.profile-menu-name').textContent = profile.name;
        document.querySelector('.profile-menu-email').textContent = profile.email;
        document.querySelectorAll('.dashboard-avatar').forEach((avatar) => {
            avatar.src = profile.image || './img/profile-avatar.svg';
        });
        profilePreview.src = profile.image || './img/profile-avatar.svg';

        document.querySelector('#profile-name').value = profile.name;
        document.querySelector('#profile-username').value = profile.username;
        document.querySelector('#profile-email').value = profile.email;
        document.querySelector('#profile-phone').value = profile.phone;
        document.querySelector('#profile-location').value = profile.location;
        document.querySelector('#profile-role').value = profile.role;
        document.querySelector('#profile-bio').value = profile.bio;

        const fields = [profile.name, profile.username, profile.email, profile.phone,
            profile.location, profile.role, profile.bio];
        const filled = fields.filter((value) => String(value).trim()).length;
        document.querySelector('#profile-completion').textContent =
            `${Math.round((filled / fields.length) * 100)}%`;
    };

    const serviceCard = (service) => `
        <article class="dashboard-service-card" data-service-id="${escapeHtml(service.id)}">
            <h2>${escapeHtml(service.title)}</h2>
            <p>${escapeHtml(service.description)}</p>
            <div class="dashboard-service-footer">
                <span class="dashboard-service-price">
                    <span>Price</span>
                    <strong>${formatAmount(service.amount)} ${escapeHtml(service.billing)}</strong>
                </span>
                <div class="dashboard-service-actions">
                    <button class="service-action" type="button" data-edit-service="${escapeHtml(service.id)}">Edit</button>
                    <button class="service-action delete" type="button" data-delete-service="${escapeHtml(service.id)}">Delete</button>
                </div>
            </div>
        </article>
    `;

    const renderServices = () => {
        const cards = services.map(serviceCard).join('');
        serviceGrid.innerHTML = cards;
        overviewServiceGrid.innerHTML = services.slice(0, 4).map(serviceCard).join('');
        serviceEmpty.hidden = services.length > 0;
        document.querySelector('#active-service-count').textContent = String(services.length);

        if (!services.length) {
            overviewServiceGrid.innerHTML = `
                <div class="dashboard-empty">
                    <span aria-hidden="true">+</span>
                    <h2>No services yet</h2>
                    <p>Create a listing to start showcasing your skills.</p>
                </div>
            `;
        }
    };

    const showSection = (sectionName) => {
        document.querySelectorAll('[data-dashboard-panel]').forEach((panel) => {
            panel.classList.toggle('active', panel.dataset.dashboardPanel === sectionName);
        });
        document.querySelectorAll('[data-dashboard-section]').forEach((button) => {
            if (button.classList.contains('dashboard-nav-item')) {
                button.classList.toggle('active', button.dataset.dashboardSection === sectionName);
            }
        });

        if (sectionName === 'services') {
            window.history.replaceState(null, '', '#services');
        } else if (sectionName === 'profile') {
            window.history.replaceState(null, '', '#profile');
        } else {
            window.history.replaceState(null, '', '#overview');
        }
    };

    document.querySelectorAll('[data-dashboard-section]').forEach((button) => {
        button.addEventListener('click', () => showSection(button.dataset.dashboardSection));
    });

    document.querySelectorAll('[data-open-profile]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showSection('profile');
        });
    });

    const openServiceDialog = (service = null) => {
        document.querySelector('#service-id').value = service?.id || '';
        document.querySelector('#service-title').value = service?.title || '';
        document.querySelector('#service-description').value = service?.description || '';
        document.querySelector('#service-amount').value = service?.amount || '';
        document.querySelector('#service-billing').value = service?.billing || 'per service';
        document.querySelector('#service-dialog-kicker').textContent = service ? 'EDIT LISTING' : 'NEW LISTING';
        document.querySelector('#service-dialog-title').textContent = service ? 'Edit your service' : 'Create a service';
        document.querySelector('#service-submit').textContent = service ? 'Save changes' : 'Publish service';
        serviceDialog.showModal();
        document.querySelector('#service-title').focus();
    };

    document.querySelectorAll('[data-open-service]').forEach((button) => {
        button.addEventListener('click', () => openServiceDialog());
    });

    document.querySelectorAll('[data-close-dialog]').forEach((button) => {
        button.addEventListener('click', () => serviceDialog.close());
    });

    serviceDialog.addEventListener('click', (event) => {
        if (event.target === serviceDialog) {
            serviceDialog.close();
        }
    });

    serviceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.querySelector('#service-id').value;
        const service = {
            id: id || (window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now())),
            title: document.querySelector('#service-title').value.trim(),
            description: document.querySelector('#service-description').value.trim(),
            amount: document.querySelector('#service-amount').value,
            billing: document.querySelector('#service-billing').value
        };

        if (id) {
            services = services.map((item) => item.id === id ? service : item);
        } else {
            services.unshift(service);
        }

        saveServices();
        renderServices();
        serviceDialog.close();
        showSection('services');
    });

    document.addEventListener('click', (event) => {
        const editButton = event.target.closest('[data-edit-service]');
        const deleteButton = event.target.closest('[data-delete-service]');

        if (editButton) {
            const service = services.find((item) => item.id === editButton.dataset.editService);
            if (service) openServiceDialog(service);
        }

        if (deleteButton) {
            const service = services.find((item) => item.id === deleteButton.dataset.deleteService);
            if (service && window.confirm(`Delete "${service.title}"?`)) {
                services = services.filter((item) => item.id !== service.id);
                saveServices();
                renderServices();
            }
        }
    });

    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        profile = {
            ...profile,
            name: document.querySelector('#profile-name').value.trim(),
            username: document.querySelector('#profile-username').value.trim(),
            email: document.querySelector('#profile-email').value.trim(),
            phone: document.querySelector('#profile-phone').value.trim(),
            location: document.querySelector('#profile-location').value.trim(),
            role: document.querySelector('#profile-role').value.trim(),
            bio: document.querySelector('#profile-bio').value.trim()
        };
        saveProfile();
        updateProfileUI();
        profileStatus.textContent = 'Profile saved.';
        profileStatus.hidden = false;
        window.setTimeout(() => {
            profileStatus.hidden = true;
        }, 3000);
    });

    profileImage.addEventListener('change', () => {
        const file = profileImage.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            window.alert('Please choose an image smaller than 5 MB.');
            profileImage.value = '';
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            profile.image = String(reader.result);
            saveProfile();
            updateProfileUI();
        });
        reader.readAsDataURL(file);
    });

    const profileMenu = document.querySelector('.profile-menu');
    const profileTrigger = document.querySelector('.profile-menu-trigger');
    const profileMenuList = document.querySelector('#dashboard-profile-menu');

    if (profileMenu && profileTrigger && profileMenuList) {
        const closeMenu = () => {
            profileMenuList.hidden = true;
            profileTrigger.setAttribute('aria-expanded', 'false');
        };

        profileTrigger.addEventListener('click', (event) => {
            event.stopPropagation();
            const opening = profileMenuList.hidden;
            profileMenuList.hidden = !opening;
            profileTrigger.setAttribute('aria-expanded', String(opening));
        });

        document.addEventListener('click', (event) => {
            if (!profileMenu.contains(event.target)) closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
                profileTrigger.focus();
            }
        });

        profileMenuList.querySelector('.profile-menu-logout').addEventListener('click', () => {
            localStorage.setItem('skillhub-signed-in', 'false');
            window.location.href = './index.html';
        });
    }

    updateProfileUI();
    renderServices();

    const hashSection = window.location.hash.slice(1);
    if (['overview', 'services', 'profile'].includes(hashSection)) {
        showSection(hashSection);
    }
});
