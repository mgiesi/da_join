/**
 * Initializes form validation by setting up validation for required fields
 */
function initFormValidation() {
    const form = document.querySelector('.add-task-form');
    const requiredFields = form.querySelectorAll('[required]');
    form.setAttribute('novalidate', '');
    requiredFields.forEach(field => setupFieldValidation(field));
    form.onsubmit = e => handleFormSubmit(e);
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
 * Handles form submission event
 * @param {Event} e - Form submission event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    validateAndSubmitForm(e);
}

/**
 * Validates form data and submits if valid
 * @param {Event} event - Form submission event
 * @returns {boolean} False to prevent default form submission
 */
async function validateAndSubmitForm(event) {
    event.preventDefault();
    const form = event.target;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = validateRequiredFields(requiredFields);

    if (!isValid) return false;

    // Check if at least one priority is selected
    const selectedPriority = getSelectedPriority();
    if (!selectedPriority) {
        alert('Please select a priority level');
        return false;
    }

    const taskData = gatherTaskData();

    try {
        await createTask(taskData);
        return showTaskAddedNotification();
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task. Please try again.');
        return false;
    }
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
 * Collects all task data from the form
 * @returns {Object} Object containing task data
 */
function gatherTaskData() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const categoryElement = document.getElementById('categorySelected');
    const categoryValue = categoryElement ? categoryElement.getAttribute('data-value') : '';

    // Map category values to database format
    let category;
    if (categoryValue === 'work') {
        category = 'task';
    } else if (categoryValue === 'personal') {
        category = 'userstory';
    } else {
        category = 'task'; // Default
    }

    const priority = getSelectedPriority();
    const assignedTo = getAssignedContacts();
    const subtasksData = getSubtasks();
    const formattedDate = formatDueDate(dueDate);

    return {
        title,
        description,
        assignedTo,
        dueDate: formattedDate,
        prio: priority,
        category,
        subtasks: subtasksData
    };
}

/**
 * Gets the currently selected priority
 * @returns {string} Selected priority level
 */
function getSelectedPriority() {
    const selectedPrioBtn = document.querySelector('.priority-btn.selected');
    return selectedPrioBtn ? selectedPrioBtn.getAttribute('data-priority') : 'medium';
}

/**
 * Formats date string to required format
 * @param {string} dueDate - Date string in DD/MM/YYYY format
 * @returns {string} Date string in YYYY-MM-DD format
 */
function formatDueDate(dueDate) {
    const [day, month, year] = dueDate.split('/');
    return `${year}-${month}-${day}`;
}

/**
 * Shows task added notification and redirects to board
 * @returns {boolean} False to prevent default form submission
 */
function showTaskAddedNotification() {
    const notification = document.getElementById('taskAddedNotification');

    if (!notification) {
        // Fallback if notification element doesn't exist
        alert('Task added to board');
        window.location.href = 'board.html';
        return false;
    }

    notification.style.display = 'flex';
    setTimeout(() => {
        notification.style.display = 'none';
        window.location.href = 'board.html';
    }, 3000);

    return false;
}

/**
 * Resets the entire form to its initial state
 */
function resetForm() {
    const form = document.querySelector('.add-task-form');
    resetInputs(form);
    resetSelects(form);
    resetCustomDropdowns();
    resetPriorityButtons();
    clearSubtasks();
    clearSubtaskInput();
    selectedContacts = [];
    updateSelectedDisplay();
    updateSelectedAvatars();
    clearSelectedAvatars();
    subtasks = [];
}

/**
 * Resets all custom dropdowns to their default state
 */
function resetCustomDropdowns() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    dropdowns.forEach(dropdown => {
        const selected = dropdown.querySelector('.custom-dropdown-selected');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');

        if (selected) {
            selected.textContent = 'Select task category';
            selected.appendChild(createDropdownArrow());
            selected.setAttribute('data-value', '');
        }

        if (hiddenInput) {
            hiddenInput.value = '';
        }
    });
}

/**
 * Resets all input fields in the form
 * @param {HTMLElement} form - Form DOM element
 */
function resetInputs(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '';
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    });
}

/**
 * Resets all select elements in the form
 * @param {HTMLElement} form - Form DOM element
 */
function resetSelects(form) {
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.value = '';
        select.style.borderColor = '';
    });
}

/**
 * Clears all subtasks from the subtasks list
 */
function clearSubtasks() {
    const subtasksContainer = document.querySelector('.subtasks-list');
    if (subtasksContainer) {
        subtasksContainer.innerHTML = '';
    }
}

/**
 * Clears the subtask input field
 */
function clearSubtaskInput() {
    const subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInput) {
        subtaskInput.value = '';
    }
}
