/**
 * Form submission and data handling functionality
 */

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
