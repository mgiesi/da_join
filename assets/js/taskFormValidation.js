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
        // Use input event instead of change for immediate feedback
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
    if (!validateFormFields(event.target)) return false;
    if (!validatePriority()) return false;
    if (!validateDueDate()) return false;

    const taskData = gatherTaskData();
    return await submitNewTask(taskData);
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
 * Submits a new task to the database
 * @param {Object} taskData - The task data to submit
 * @returns {boolean} False to prevent default form submission
 */
async function submitNewTask(taskData) {
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
 * Handles form submission event when editing a task
 * @param {Event} e - Form submission event
 * @param {string} taskId - Id of the task
 */
function handleFormSubmit4Edit(e, taskId) {
    e.preventDefault();
    validateAndSubmitForm4Edit(e, taskId);
}

/**
 * Validates form data and submits if valid when editing a task
 * @param {Event} event - Form submission event
 * @param {string} taskId - Id of the task
 * @returns {boolean} False to prevent default form submission
 */
async function validateAndSubmitForm4Edit(event, taskId) {
    event.preventDefault();
    if (!validateFormFields(event.target)) return false;
    if (!validatePriority()) return false;
    if (!validateDueDate()) return false;

    const taskData = gatherTaskData();
    return await submitEditedTask(taskData, taskId);
}

/**
 * Submits an edited task to the database
 * @param {Object} taskData - The task data to submit
 * @param {string} taskId - Id of the task
 * @returns {boolean} False to prevent default form submission
 */
async function submitEditedTask(taskData, taskId) {
    try {
        await updateTask(taskId, taskData);
        return showTaskAddedNotification();
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
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
 * Validates that the due date is not in the past
 * @returns {boolean} True if due date is valid
 */
function validateDueDate() {
    const dueDateField = document.getElementById('dueDate');
    if (!dueDateField || !dueDateField.value) return true;

    // Get the date value directly from the input
    const selectedDate = new Date(dueDateField.value);
    const today = new Date();

    // Reset time parts for accurate comparison
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
/**
 * Collects all task data from the form
 * @returns {Object} Object containing task data
 */
function gatherTaskData() {
    const basicData = getBasicTaskData();
    const category = getCategoryValue();
    const additionalData = getAdditionalTaskData();

    return {
        ...basicData,
        category,
        ...additionalData
    };
}

/**
 * Gets basic task data from form fields
 * @returns {Object} Basic task data
 */
function getBasicTaskData() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const formattedDate = formatDueDate(dueDate);

    return {
        title,
        description,
        dueDate: formattedDate
    };
}

/**
 * Gets the category value from the form
 * @returns {string} Category value
 */
function getCategoryValue() {
    const categoryElement = document.getElementById('categorySelected');
    const categoryValue = categoryElement ? categoryElement.getAttribute('data-value') : '';

    if (categoryValue === 'work') return 'task';
    if (categoryValue === 'personal') return 'userstory';
    return 'task'; // Default
}

/**
 * Gets additional task data from the form
 * @returns {Object} Additional task data
 */
function getAdditionalTaskData() {
    const priority = getSelectedPriority();
    const assignedTo = getAssignedContacts();
    const subtasksData = getSubtasks();

    return {
        prio: priority,
        assignedTo,
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
    resetFormElements(form);
    resetContactsAndSubtasks();
}

/**
 * Resets form elements to their default state
 * @param {HTMLElement} form - Form DOM element
 */
function resetFormElements(form) {
    resetInputs(form);
    resetSelects(form);
    resetCustomDropdowns();
    resetPriorityButtons();
}

/**
 * Resets contacts and subtasks to their default state
 */
function resetContactsAndSubtasks() {
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
        resetSingleDropdown(dropdown);
    });
}

/**
 * Resets a single dropdown to its default state
 * @param {HTMLElement} dropdown - Dropdown DOM element
 */
function resetSingleDropdown(dropdown) {
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
}

/**
 * Creates a dropdown arrow element
 * @returns {HTMLElement} Dropdown arrow element
 */
function createDropdownArrow() {
    const arrowImg = document.createElement('img');
    arrowImg.src = './assets/icons/arrow_drop_down.svg';
    arrowImg.alt = 'Dropdown arrow';
    arrowImg.className = 'dropdown-arrow';
    return arrowImg;
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
