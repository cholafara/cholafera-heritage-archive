document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navPanel = document.querySelector('.nav-panel');
    const dropdownToggles = Array.from(document.querySelectorAll('.dropdown-toggle'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

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

    setActiveLink();

    if (navToggle && navPanel) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            setMenuState(!expanded);
            if (!expanded) {
                closeSubmenus();
            }
        });
    }

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
        });

        button.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeSubmenus();
                setMenuState(false);
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
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar')) {
            closeSubmenus();
            if (window.innerWidth <= 900) {
                setMenuState(false);
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSubmenus();
            setMenuState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            setMenuState(false);
            closeSubmenus();
        }
    });
});
