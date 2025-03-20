/**
 * Functions for editing tasks in the board
 */

/**
 * Shows the edit task details overlay.
 * @async
 * @param {string} taskId - The task ID to edit
 * @returns {Promise<void>}
 */
async function showEditTaskDetails(taskId) {
    hideCategoryGroup();
    const [task, contacts] = await Promise.all([getTask(taskId), getContacts()]);
    setupEditTaskForm(taskId, task, contacts);
}

/**
 * Sets up the edit task form with task data.
 * @param {string} taskId - The task ID
 * @param {Object} task - The task data
 * @param {Object} contacts - The contacts data
 */
function setupEditTaskForm(taskId, task, contacts) {
    loadTaskEditContent(taskId, task, contacts);
    configureEditFormSubmit(taskId);
    configureSubmitButton("Ok");
    showOverlay("overlayAddTask");
}

/**
 * Configures the form submission for editing a task.
 * @param {string} taskId - The task ID being edited
 */
function configureEditFormSubmit(taskId) {
    const addTaskForm = document.getElementById("add-task-form");
    addTaskForm.onsubmit = function (event) {
        handleFormSubmit4Edit(event, taskId);
    };
}

/**
 * Hides the edit task details overlay.
 */
function hideEditTaskDetails() {
    hideOverlay("overlayAddTask");
    showCategoryGroup();
}

/**
 * Loads task data into the edit form.
 * @param {string} taskId - The task ID
 * @param {Object} task - The task data
 * @param {Object} contactsFromDb - The contacts data
 */
function loadTaskEditContent(taskId, task, contactsFromDb) {
    setBasicTaskFields(task);
    setPriorityButtons(task.prio);
    setCategoryField(task.category);
    loadAssignedContacts(task);
    loadSubtasks(task);
}

/**
 * Sets the basic task fields in the edit form.
 * @param {Object} task - The task data
 */
function setBasicTaskFields(task) {
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("dueDate").value = getTaskDueDate4InputField(task.dueDate);
}

/**
 * Sets the priority buttons based on task priority.
 * @param {string} priority - The task priority
 */
function setPriorityButtons(priority) {
    const priorities = ["urgent", "medium", "low"];
    priorities.forEach(prio => {
        const btn = document.getElementById(`add-task-btn-${prio}`);
        if (prio === priority) {
            btn.classList.add("active", "selected");
        } else {
            btn.classList.remove("active", "selected");
        }
    });
}

/**
 * Sets the category field in the edit form.
 * @param {string} category - The task category
 */
function setCategoryField(category) {
    const isUserStory = category === "userstory";
    document.getElementById("categorySelected").setAttribute(
        "data-value",
        isUserStory ? "personal" : "work"
    );
    document.getElementById("category").value = isUserStory ? "User Story" : "Technical Task";
}

/**
 * Loads assigned contacts into the edit form.
 * @param {Object} task - The task data
 */
function loadAssignedContacts(task) {
    selectedContacts = [];
    const contactsCount = task && task.assignedTo ? Object.keys(task.assignedTo).length : 0;
    if (contactsCount > 0) {
        Object.keys(task.assignedTo).forEach((contactId) => {
            selectedContacts.push(contactId);
        });
    }
    updateSelectedAvatars();
}

/**
 * Loads subtasks into the edit form.
 * @param {Object} task - The task data
 */
function loadSubtasks(task) {
    subtasks = [];
    const subTasksCount = task && task.subtasks ? Object.keys(task.subtasks).length : 0;
    if (subTasksCount > 0) {
        Object.keys(task.subtasks).forEach((subtaskId) => {
            const subtask = task.subtasks[subtaskId];
            subtask['id'] = subtaskId;
            subtasks.push(subtask);
        });
    }
    renderSubtasks();
}

/**
 * Resets the edit task form fields.
 */
function resetEditTaskContent() {
    clearBasicFields();
    resetPrioritySelection();
    clearContactsAndSubtasks();
}

/**
 * Clears the basic form fields.
 */
function clearBasicFields() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
}

/**
 * Resets the priority selection to default (medium).
 */
function resetPrioritySelection() {
    document.getElementById("add-task-btn-urgent").classList.remove("active", "selected");
    document.getElementById("add-task-btn-medium").classList.add("active", "selected");
    document.getElementById("add-task-btn-low").classList.remove("active", "selected");
}

/**
 * Clears contacts and subtasks from the form.
 */
function clearContactsAndSubtasks() {
    selectedContacts = [];
    updateSelectedAvatars();
    subtasks = [];
    renderSubtasks();
}
