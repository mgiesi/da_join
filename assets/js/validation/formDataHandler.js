/**
 * Form data gathering and formatting functionality
 */

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
    return 'task'; 
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
