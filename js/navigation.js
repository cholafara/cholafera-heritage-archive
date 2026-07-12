document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navPanel = document.querySelector('.nav-panel');
    const dropdownToggles = Array.from(document.querySelectorAll('.dropdown-toggle'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const themeToggle = document.querySelector('.theme-toggle');
    const searchToggle = document.querySelector('.search-toggle');
    const searchPanel = document.querySelector('.search-panel');
    const searchInput = document.querySelector('.search-panel input[type="search"]');
    const searchStatus = document.querySelector('.search-status');

    const closeSubmenus = (activeButton = null) => {
        dropdownToggles.forEach((button) => {
            if (button === activeButton) {
                return;
            }

            button.setAttribute('aria-expanded', 'false');
            button.classList.remove('is-active');
            const submenu = button.closest('.nav-item')?.querySelector('.dropdown-menu');
            submenu?.classList.remove('is-open');
        });
    };

    const setMenuState = (expanded) => {
        if (!navToggle || !navPanel) {
            return;
        }

        navToggle.setAttribute('aria-expanded', String(expanded));
        navPanel.classList.toggle('is-open', expanded);
        navPanel.setAttribute('aria-hidden', String(!expanded));
        navToggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
    };

    const setSearchState = (expanded) => {
        if (!searchPanel || !searchToggle) {
            return;
        }

        searchPanel.classList.toggle('is-open', expanded);
        searchToggle.setAttribute('aria-expanded', String(expanded));
        searchToggle.setAttribute('aria-label', expanded ? 'Close search' : 'Open search');
        if (!expanded) {
            searchStatus && (searchStatus.textContent = '');
        }
    };

    const setActiveLink = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const normalizedPath = currentPath.toLowerCase();
        const isHomePage = normalizedPath === '' || normalizedPath === 'index.html' || normalizedPath === '/';

        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            const hrefPath = href.split('/').pop().toLowerCase();
            const matches = isHomePage ? hrefPath === 'index.html' : hrefPath === normalizedPath;

            link.classList.toggle('is-active', matches);
            if (matches) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const focusSibling = (currentItem, direction) => {
        const items = Array.from(currentItem.parentElement?.querySelectorAll('.nav-link, .dropdown-toggle') || []);
        const currentIndex = items.indexOf(currentItem);
        const nextIndex = (currentIndex + direction + items.length) % items.length;
        const nextItem = items[nextIndex];
        nextItem?.focus();
    };

    const applyTheme = (theme) => {
        const selectedTheme = theme === 'dark' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', selectedTheme);
        themeToggle?.setAttribute('aria-pressed', String(selectedTheme === 'dark'));
        const icon = themeToggle?.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = selectedTheme === 'dark' ? '☀️' : '🌙';
        }
        localStorage.setItem('cholafera-theme', selectedTheme);
    };

    const savedTheme = localStorage.getItem('cholafera-theme');
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    setActiveLink();

    if (navToggle && navPanel) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            setMenuState(!expanded);
            if (!expanded) {
                closeSubmenus();
                setSearchState(false);
            }
        });
    }

    if (searchToggle && searchPanel) {
        searchToggle.addEventListener('click', () => {
            const expanded = searchPanel.classList.contains('is-open');
            setSearchState(!expanded);
            if (!expanded) {
                searchInput?.focus();
            }
        });
    }

    themeToggle?.addEventListener('click', () => {
        const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    const searchIndex = [
        { label: 'Home', url: 'index.html', keywords: ['home', 'welcome'] },
        { label: 'Collections', url: 'collections.html', keywords: ['collections', 'all collections', 'collection'] },
        { label: 'Historical Coins', url: 'historical-coins.html', keywords: ['historical coins', 'coin', 'coins'] },
        { label: 'Historical Banknotes', url: 'historical-banknotes.html', keywords: ['historical banknotes', 'banknote', 'banknotes'] },
        { label: 'Bangladesh Coins', url: 'bangladesh-coins.html', keywords: ['bangladesh coins', 'bangladesh'] },
        { label: 'World Coins', url: 'world-coins.html', keywords: ['world coins', 'world'] },
        { label: 'Commemorative Coins', url: 'commemorative-coins.html', keywords: ['commemorative coins', 'commemorative'] },
        { label: 'About', url: 'about.html', keywords: ['about', 'founder', 'organization', 'supporting'] },
        { label: 'Archive', url: 'archive.html', keywords: ['archive'] },
        { label: 'Documents', url: 'documents.html', keywords: ['documents', 'document'] },
        { label: 'Publications', url: 'publications.html', keywords: ['publications', 'publication'] },
        { label: 'Gallery', url: 'gallery.html', keywords: ['gallery', 'photo', 'photography'] },
        { label: 'Contact', url: 'contact.html', keywords: ['contact', 'email', 'phone', 'address'] }
    ];

    searchPanel?.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput?.value.trim().toLowerCase() || '';
        const matchedPage = searchIndex.find((item) => item.keywords.some((keyword) => query.includes(keyword) || keyword.includes(query)));

        if (matchedPage) {
            window.location.href = matchedPage.url;
            return;
        }

        if (searchStatus) {
            searchStatus.textContent = 'No matching page found. Try “coins”, “banknotes”, “about”, or “contact”.';
        }
    });

    dropdownToggles.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const navItem = button.closest('.nav-item');
            const submenu = navItem?.querySelector('.dropdown-menu');
            const expanded = button.getAttribute('aria-expanded') === 'true';

            closeSubmenus(button);
            button.setAttribute('aria-expanded', String(!expanded));
            button.classList.toggle('is-active', !expanded);
            submenu?.classList.toggle('is-open', !expanded);
            setSearchState(false);
        });

        button.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeSubmenus();
                setMenuState(false);
                setSearchState(false);
                return;
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const nextMenu = button.closest('.nav-item')?.querySelector('.dropdown-menu .dropdown-link');
                if (nextMenu) {
                    nextMenu.focus();
                }
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                const lastLink = button.closest('.nav-item')?.querySelector('.dropdown-menu .dropdown-link:last-of-type');
                lastLink?.focus();
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                focusSibling(button, 1);
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                focusSibling(button, -1);
            }
        });

        button.addEventListener('focus', () => {
            if (window.innerWidth > 900) {
                const navItem = button.closest('.nav-item');
                const submenu = navItem?.querySelector('.dropdown-menu');
                closeSubmenus(button);
                button.setAttribute('aria-expanded', 'true');
                button.classList.add('is-active');
                submenu?.classList.add('is-open');
            }
        });

        button.addEventListener('blur', (event) => {
            if (window.innerWidth > 900) {
                const nextTarget = event.relatedTarget;
                if (!nextTarget || !nextTarget.closest('.nav-item')) {
                    closeSubmenus();
                }
            }
        });
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                setMenuState(false);
                closeSubmenus();
            }
            setSearchState(false);
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar')) {
            closeSubmenus();
            setSearchState(false);
            if (window.innerWidth <= 900) {
                setMenuState(false);
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSubmenus();
            setSearchState(false);
            setMenuState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            setMenuState(false);
            closeSubmenus();
            setSearchState(false);
        }
    });
});
