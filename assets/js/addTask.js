/**
 * Initializes the add task page by loading HTML components, fetching contacts, and setting up functionality
 */
function init() {
    includeHTML();
    fetchContacts();
    initializeAll();
}

/**
 * Sets up all core functionality components for the add task page
 */
function initializeAll() {
    initFormValidation();
    setupPrioritySystem();
    setupSelectArrows();
    initializeContactDropdown();
    loadContacts();
}

/**
 * Sets up focus behavior for all select elements wrapped in .select-wrapper class
 */
function setupSelectArrows() {
    const selectWrappers = document.querySelectorAll('.select-wrapper');
    selectWrappers.forEach(wrapper => setupSelectFocus(wrapper));
}

/**
 * Handles focus and blur events for individual select elements
 * @param {HTMLElement} wrapper - DOM element containing the select element
 */
function setupSelectFocus(wrapper) {
    const select = wrapper.querySelector('select');
    select.onfocus = () => wrapper.classList.add('focused');
    select.onblur = () => wrapper.classList.remove('focused');
}

/**
 * Initializes the priority selection system by setting up the global click handler
 */
function setupPrioritySystem() {
    window.handlePriorityClick = function (buttonElement) {
        resetPriorityButtons();
        activatePriorityButton(buttonElement);
    };
}

/**
 * Resets all priority buttons to their default state
 */
function resetPriorityButtons() {
    const buttons = document.querySelectorAll('.priority-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'selected');
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.borderColor = '';
    });
}

/**
 * Activates the selected priority button
 * @param {HTMLElement} buttonElement - The priority button DOM element to activate
 */
function activatePriorityButton(buttonElement) {
    buttonElement.classList.add('active', 'selected');
    const priority = buttonElement.getAttribute('data-priority');
}

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
    const taskData = gatherTaskData();
    try {
        await createTask(taskData);
        showNotification();
        resetForm();
        selectedContacts.clear();
        updateSelectedContactsDisplay();
        return false;
    } catch (error) {
        console.error('Error creating task:', error);
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
    const category = document.getElementById('category').value;
    const priority = getSelectedPriority();
    const assignedTo = getAssignedContacts();
    const subtasks = getSubtasks();
    const formattedDate = formatDueDate(dueDate);
    return {
        title,
        description,
        assignedTo,
        dueDate: formattedDate,
        prio: priority,
        category: category === 'work' ? 'task' : 'userstory',
        subtasks
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
 * Gets the list of assigned contacts
 * @returns {Object} Object with contact IDs as keys
 */
function getAssignedContacts() {
    const assignedTo = {};
    selectedContacts.forEach(id => {
        assignedTo[id] = true;
    });
    return assignedTo;
}

/**
 * Collects all subtasks from the subtasks list
 * @returns {Object} Object containing subtask data
 */
function getSubtasks() {
    const subtasksContainer = document.querySelector('.subtasks-list');
    const subtasks = {};
    if (subtasksContainer) {
        const subtaskElements = subtasksContainer.querySelectorAll('.subtask-item');
        subtaskElements.forEach((element, index) => {
            const subtaskText = element.querySelector('.subtask-text').textContent;
            subtasks[`subtask${index + 1}`] = {
                name: subtaskText,
                done: false
            };
        });
    }
    return subtasks;
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
 * Shows success notification and redirects to board after task creation
 */
function showNotification() {
    const notification = document.getElementById('taskAddedNotification');
    notification.style.display = 'flex';
    setTimeout(() => {
        notification.style.display = 'none';
        window.location.href = 'board.html';
    }, 3000);
}

/**
 * Resets the entire form to its initial state
 */
function resetForm() {
    const form = document.querySelector('.add-task-form');
    resetInputs(form);
    resetSelects(form);
    resetPriorityButtons();
    clearSubtasks();
    clearSubtaskInput();
    selectedContacts = [];
    updateSelectedDisplay();
    updateSelectedAvatars();
    clearSelectedAvatars();
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

/**
 * Clears all selected contact avatars
 */
function clearSelectedAvatars() {
    const avatarDiv = document.getElementById('selectedContactsAvatar');
    if (avatarDiv) {
        avatarDiv.innerHTML = '';
    }
}

/** @type {Object} Object to store contacts data */
let contacts = {};
/** @type {Array} Array to store selected contact IDs */
let selectedContacts = [];

/**
 * Fetches contacts data from the Firebase database
 * @returns {Promise<void>}
 */
async function fetchContacts() {
    try {
        const response = await fetch('https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        contacts = data || {};
        renderContactsList();
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

/**
 * Toggles the visibility of the contact selection dropdown
 */
function toggleContactDropdown() {
    const list = document.getElementById('contactList');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
}

/**
 * Renders the list of contacts in the dropdown
 */
function renderContactsList() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    const sortedContacts = getSortedContacts();
    sortedContacts.forEach(([id, contact]) => {
        const contactDiv = createContactDiv(id, contact);
        contactList.innerHTML += contactDiv;
    });
}

/**
 * Gets contacts sorted alphabetically by name
 * @returns {Array} Array of sorted contact entries
 */
function getSortedContacts() {
    return Object.entries(contacts)
        .filter(([_, contact]) => contact && contact.name)
        .sort((a, b) => a[1].name.localeCompare(b[1].name));
}

/**
 * Creates HTML for a contact list item
 * @param {string} id - Contact ID
 * @param {Object} contact - Contact object
 * @returns {string} HTML string for contact div
 */
function createContactDiv(id, contact) {
    const initials = getInitials(contact.name);
    return `
        <div class="contact-item" onclick="toggleContactSelection('${id}')">
            <div class="contact-info-container">
                <div class="contact-avatar" style="background-color: ${contact.avatarColor || '#000000'}">
                    ${initials}
                </div>
                <div class="contact-name">${contact.name}</div>
            </div>
            <input type="checkbox" class="contact-checkbox" ${selectedContacts.includes(id) ? 'checked' : ''}>
        </div>
    `;
}

/**
 * Toggles selection state of a contact
 * @param {string} contactId - ID of the contact to toggle
 */
function toggleContactSelection(contactId) {
    const index = selectedContacts.indexOf(contactId);
    if (index === -1) {
        selectedContacts.push(contactId);
    } else {
        selectedContacts.splice(index, 1);
    }
    renderContactsList();
    updateSelectedDisplay();
    updateSelectedAvatars();
}

/**
 * Updates the contact search input display
 */
function updateSelectedDisplay() {
    const searchInput = document.getElementById('contactSearch');
    searchInput.value = '';
    searchInput.placeholder = 'Select contacts to assign';
}

/**
 * Updates the display of selected contact avatars
 */
function updateSelectedAvatars() {
    const avatarDiv = document.getElementById('selectedContactsAvatar');
    if (!avatarDiv) return;
    avatarDiv.innerHTML = '';
    selectedContacts.forEach(contactId => {
        const contact = contacts[contactId];
        if (contact) {
            const initials = getInitials(contact.name);
            const avatarElement = createAvatarElement(contact, initials);
            avatarDiv.appendChild(avatarElement);
        }
    });
}

/**
 * Creates an avatar element for a contact
 * @param {Object} contact - Contact object
 * @param {string} initials - Contact initials
 * @returns {HTMLElement} Avatar DOM element
 */
function createAvatarElement(contact, initials) {
    const avatarElement = document.createElement('div');
    avatarElement.className = 'contact-avatar-selected';
    avatarElement.style.backgroundColor = contact.avatarColor || '#000000';
    avatarElement.textContent = initials;
    return avatarElement;
}

/**
 * Extracts initials from a full name
 * @param {string} name - Full name
 * @returns {string} Initials in uppercase
 */
function getInitials(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
}