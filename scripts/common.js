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
            navigation.classList.toggle('open');
            hamButton.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {
            if (!navigation.contains(event.target) && !hamButton.contains(event.target)) {
                navigation.classList.remove('open');
                hamButton.classList.remove('open');
            }
        });
    }
}

function setupCardFlip() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            card.querySelector('.card-inner').classList.toggle('is-flipped');
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
