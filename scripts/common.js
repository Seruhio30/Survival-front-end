document.addEventListener("DOMContentLoaded", function() {
    initializeYear();
    initializeLastModified();
    setupHamburgerMenu();
    setupCardFlip();
    setupScrollButton();
    initializeStoredData();
});

function initializeYear() {
    const currentYearElement = document.getElementById("currentyear");
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

function initializeLastModified() {
    const lastModifiedElement = document.getElementById("lastModified");
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

function setupHamburgerMenu() {
    const hamButton = document.querySelector('#hamburger');
    const navigation = document.querySelector('#nav-menu');

    if (hamButton && navigation) {
        hamButton.addEventListener('click', () => {
            const isOpen = navigation.classList.toggle('open');
            hamButton.classList.toggle('open', isOpen);
            hamButton.setAttribute('aria-expanded', String(isOpen));
            hamButton.setAttribute(
                'aria-label',
                isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
            );
        });

        document.addEventListener('click', (event) => {
            if (!navigation.contains(event.target) && !hamButton.contains(event.target)) {
                navigation.classList.remove('open');
                hamButton.classList.remove('open');
                hamButton.setAttribute('aria-expanded', 'false');
                hamButton.setAttribute('aria-label', 'Abrir menú de navegación');
            }
        });
    }
}

function setupCardFlip() {
    document.querySelectorAll('.card-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const panelId = button.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);

            if (!panel) {
                return;
            }

            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', String(!isExpanded));
            panel.hidden = isExpanded;
        });
    });
}

function setupScrollButton() {
    const scrollButton = document.getElementById("more-info");
    if (scrollButton) {
        scrollButton.addEventListener('click', function () {
            window.location.href = 'secondaryPage.html#backPack72';
        });
    }
}

function initializeStoredData() {
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    const theme = userPreferences.theme || 'light';

    document.body.classList.toggle('dark-theme', theme === 'dark');

    const saveButton = document.getElementById('save-preferences');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const newTheme = document.querySelector('input[name="theme"]:checked').value;
            localStorage.setItem('userPreferences', JSON.stringify({ theme: newTheme }));
            document.body.classList.toggle('dark-theme', newTheme === 'dark');
        });
    }
}
