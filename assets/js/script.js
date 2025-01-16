async function init() {
    await includeHTML();
    setActiveMenuItem();
    addMenuClickListeners();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');

    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute('w3-include-html');
        let resp = await fetch(file);

        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function setActiveMenuItem() {
    // Get all menu buttons
    const menuButtons = document.querySelectorAll('.menu-button');

    // Get the current page filename
    const currentPage = window.location.pathname.split('/').pop();

    // Remove active class from all buttons first
    menuButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add active class to the button that matches current page
    menuButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (href.includes(currentPage)) {
            button.classList.add('active');
            // Store the active menu item
            localStorage.setItem('activeMenuItem', href);
        }
    });

    // If no page matches (like on first load), check localStorage
    const activeMenuItem = localStorage.getItem('activeMenuItem');
    if (!currentPage && activeMenuItem) {
        menuButtons.forEach(button => {
            if (button.getAttribute('href') === activeMenuItem) {
                button.classList.add('active');
            }
        });
    }
}

function addMenuClickListeners() {
    const menuButtons = document.querySelectorAll('.menu-button');

    menuButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Remove active class from all buttons
            menuButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Store the active menu item's href in localStorage
            localStorage.setItem('activeMenuItem', this.getAttribute('href'));
        });
    });
}

function validateFormField(inputElement) {
    const formGroup = inputElement.closest('.form-group');

    if (!inputElement.value.trim()) {
        formGroup.classList.add('error');
        return false;
    } else {
        formGroup.classList.remove('error');
        return true;
    }
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title');

    titleInput.addEventListener('blur', (e) => {
        validateFormField(e.target);
    });

    // For form submission
    document.querySelector('.add-task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const isValid = validateFormField(titleInput);
        if (isValid) {
            // Proceed with form submission
        }
    });
});
