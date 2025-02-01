function init() {
    includeHTML().then(() => {
        initializeAll();
    });
}

function initializeAll() {
    initFormValidation();
    setupPrioritySystem();
}

function setupPrioritySystem() {
    window.handlePriorityClick = function (buttonElement) {
        const buttons = document.querySelectorAll('.priority-btn');

        buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        });

        buttonElement.classList.add('active');
        const priority = buttonElement.getAttribute('data-priority');
    };
}

async function includeHTML() {
    const elements = document.querySelectorAll('[w3-include-html]');
    for (let element of elements) {
        const file = element.getAttribute('w3-include-html');
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            element.innerHTML = html;
            element.removeAttribute('w3-include-html');
        } catch (error) {
            console.error('Error loading HTML:', error);
        }
    }
}

function initFormValidation() {
    const form = document.querySelector('.add-task-form');
    const requiredFields = form.querySelectorAll('[required]');

    form.setAttribute('novalidate', '');

    requiredFields.forEach(field => {
        if (!field.parentNode.querySelector('.error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required';
            field.parentNode.appendChild(errorMessage);
        }

        field.oninput = function () {
            if (field.value.trim()) {
                field.style.borderColor = '';
                const errorMessage = field.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            }
        };
    });

    form.onsubmit = function (e) {
        e.preventDefault();
        validateForm(requiredFields);
    };
}

function validateForm(requiredFields) {
    let isValid = true;

    requiredFields.forEach(field => {
        field.style.borderColor = '';
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }

        if (!field.value.trim()) {
            field.style.borderColor = '#FF3D00';
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
            isValid = false;
        }
    });

    if (isValid) {
        // Form submission logic will go here
    }
}