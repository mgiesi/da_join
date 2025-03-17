/**
 * Form reset functionality
 */

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
