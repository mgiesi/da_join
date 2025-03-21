/**
 * Core form validation functionality
 */

/**
 * Initializes form validation by setting up validation for required fields
 */
function initFormValidation() {
    const form = document.querySelector('.add-task-form');
    const requiredFields = form.querySelectorAll('[required]');
    form.setAttribute('novalidate', '');
    requiredFields.forEach(field => setupFieldValidation(field));
    setupDateValidation();
    form.onsubmit = e => handleFormSubmit(e);
}

/**
 * Sets up date field validation to check for past dates
 */
function setupDateValidation() {
    const dateField = document.getElementById('dueDate');
    if (dateField) {
        dateField.addEventListener('input', function () {
            validateDueDate();
        });
    }
}

/**
 * Sets up validation for individual form fields
 * @param {HTMLElement} field - Form field DOM element to validate
 */
function setupFieldValidation(field) {
    if (!field.parentNode.querySelector('.error-message')) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'This field is required';
        field.parentNode.appendChild(errorMessage);
    }
    field.oninput = () => validateFieldInput(field);
}

/**
 * Validates input on field change and manages error states
 * @param {HTMLElement} field - Form field DOM element being validated
 */
function validateFieldInput(field) {
    if (field.value.trim()) {
        field.style.borderColor = '';
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
}

/**
 * Validates all form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} True if all fields are valid
 */
function validateFormFields(form) {
    const requiredFields = form.querySelectorAll('[required]');
    return validateRequiredFields(requiredFields);
}

/**
 * Validates all required fields in the form
 * @param {NodeList} requiredFields - NodeList of required form fields
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateRequiredFields(requiredFields) {
    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'red';
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
        }
    });
    return isValid;
}

/**
 * Validates that a priority is selected
 * @returns {boolean} True if priority is selected
 */
function validatePriority() {
    const selectedPriority = getSelectedPriority();
    if (!selectedPriority) {
        alert('Please select a priority level');
        return false;
    }
    return true;
}

/**
 * Validates that the due date is not in the past
 * @returns {boolean} True if due date is valid
 */
function validateDueDate() {
    const dueDateField = document.getElementById('dueDate');
    if (!dueDateField || !dueDateField.value) return true;

    const selectedDate = new Date(dueDateField.value);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        dueDateField.style.borderColor = 'red';
        showErrorMessage(dueDateField, 'Due date cannot be in the past');
        return false;
    } else {
        dueDateField.style.borderColor = '';
        hideErrorMessage(dueDateField);
        return true;
    }
}

/**
 * Shows error message for a field
 * @param {HTMLElement} field - Field with error
 * @param {string} message - Error message to display
 */
function showErrorMessage(field, message) {
    let errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }
}

/**
 * Hides error message for a field
 * @param {HTMLElement} field - Field to hide error for
 */
function hideErrorMessage(field) {
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.style.display = 'none';
    }
}

/**
 * Shows error message for date field
 * @param {HTMLElement} field - Date field with error
 */
function showDateError(field) {
    field.style.borderColor = 'red';
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.textContent = 'Due date cannot be in the past';
        errorMsg.style.display = 'block';
    }
}
