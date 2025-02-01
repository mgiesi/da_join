function init() {
    initFormValidation();
    initSubtasks();
    initDateHandling();
}

function initFormValidation() {
    const form = document.querySelector('.add-task-form');
    form.onsubmit = function (e) {
        e.preventDefault();
        return validateForm();
    };

    // Add click handlers for inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    for (let input of inputs) {
        input.onclick = function () {
            setActiveInput(input);
        };
    }
}

function setActiveInput(activeInput) {
    const inputs = document.querySelectorAll('input, textarea, select');
    for (let input of inputs) {
        input.classList.remove('active');
    }
    activeInput.classList.add('active');
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;

    for (let field of requiredFields) {
        if (!validateField(field)) {
            isValid = false;
        }
    }

    if (isValid) {
        console.log('Form is valid, submitting...');
        // Add your form submission logic here
    }
    return false;
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!field.value.trim()) {
        formGroup.classList.add('error');
        return false;
    }
    formGroup.classList.remove('error');
    return true;
}

function initDateHandling() {
    const dateInput = document.getElementById('dueDate');
    const calendarIcon = document.querySelector('.calendar-icon');

    dateInput.onkeyup = function () {
        formatDateInput(this);
    };

    dateInput.onblur = function () {
        validateDateInput(this);
    };

    calendarIcon.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCalendar();
    };
}

function formatDateInput(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length > 8) {
        value = value.slice(0, 8);
    }

    if (value.length >= 4) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
    } else if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }

    input.value = value;
}

function validateDateInput(input) {
    const value = input.value;
    if (!value) return;

    const parts = value.split('/');
    if (parts.length !== 3) {
        input.value = '';
        alert('Please enter the date in dd/mm/yyyy format');
        return;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month - 1, day);

    const isValid = date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year &&
        year >= new Date().getFullYear();

    if (!isValid) {
        input.value = '';
        alert('Please enter a valid future date in dd/mm/yyyy format');
    }
}

function toggleCalendar() {
    const dateInput = document.getElementById('dueDate');
    const calendar = new Calendar(dateInput);
    calendar.toggle();
}

window.onload = init;
