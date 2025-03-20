/**
 * Functions for displaying task details in the board
 */

/**
 * Shows task details in an overlay.
 * @async
 * @param {string} boardName - The board the task belongs to
 * @param {string} taskId - The task ID
 * @returns {Promise<void>}
 */
async function showTaskDetails(boardName, taskId) {
    resetEditTaskContent();
    const [task, contacts] = await Promise.all([getTask(taskId), getContacts()]);
    populateTaskDetails(taskId, task, contacts, boardName);
}

/**
 * Populates the task details overlay with task information.
 * @param {string} taskId - The task ID
 * @param {Object} task - The task data
 * @param {Object} contacts - The contacts data
 * @param {string} boardName - The board name
 */
function populateTaskDetails(taskId, task, contacts, boardName) {
    let overlay = document.getElementById("taskDetails");
    overlay.innerHTML = getTaskDetails(taskId, task, contacts, boardName);
    overlay.classList.remove("dNone");
    openModal();
}

/**
 * Hides the task details overlay.
 */
function hideTaskDetails() {
    hideOverlay("taskDetails");
}

/**
 * Deletes a task and updates the UI.
 * @async
 * @param {string} boardName - The board name
 * @param {string} taskId - The task ID to delete
 */
async function doDeleteTask(boardName, taskId) {
    await deleteTask(taskId);
    await removeTaskFromBoard(boardName, taskId);
    renderTasks();
    hideTaskDetails();
    showDeleteMessage();
}

/**
 * Shows the category group in the form.
 */
function showCategoryGroup() {
    document.getElementById("form-group-category").classList.remove("dNone");
}

/**
 * Hides the category group in the form.
 */
function hideCategoryGroup() {
    document.getElementById("form-group-category").classList.add("dNone");
}

/**
 * Finds the first non-empty text node in an element.
 * @param {HTMLElement} element - The element to search in
 * @returns {Node|null} The found text node or null
 */
function findTextNode(element) {
    return Array.from(element.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
    );
}

/**
 * Configures the submit button with the specified text.
 * @param {string} text - The text to set on the button
 */
function configureSubmitButton(text) {
    const btnSubmit = document.getElementById("btn-add-task-submit");
    const textNode = findTextNode(btnSubmit);
    if (textNode) {
        textNode.textContent = text;
    }
}

/**
 * Sets up the add task form for submission.
 */
function setupAddTaskForm() {
    const addTaskForm = document.getElementById("add-task-form");
    addTaskForm.onsubmit = handleFormSubmit;
    resetEditTaskContent();
}
