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
    if (!select) {
        console.warn('Select element not found in wrapper:', wrapper);
        return;
    }
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