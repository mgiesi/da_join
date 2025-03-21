/**
 * Generates HTML for task details overlay
 * @param {string} taskId - ID of the task
 * @param {Object} task - Task data object
 * @param {Object} contacts - Contacts data object
 * @param {string} boardName - Name of the board
 * @returns {string} HTML content for task details
 */
function getTaskDetails(taskId, task, contacts, boardName) {
  if (!task) return "";
  return `
        <div class="overlay-taskDetails">
            ${getTaskDetailsHeader(task)}
            ${getTaskDetailsContent(task)}
            ${getTaskDetailsPriority(task)}
            ${getTaskDetailsAssignedTo(task, contacts)}
            ${displaySubTasks4TaskDetails(taskId, task)}
            ${getTaskDetailsButtons(boardName, taskId)}
        </div>
    `;
}

/**
 * Generates HTML for task details header section
 * @param {Object} task - Task data object
 * @returns {string} HTML content for task header
 */
function getTaskDetailsHeader(task) {
  return `
    <div class="topDetails">
        ${displayTaskType(task.category)}
        <img onclick="hideTaskDetails()" class="close-btn" src="./assets/icons/cancel.svg" alt="">
    </div>
    <div class="taskHeadline">
        <h1 class="f1">${task.title}</h1>
    </div>
    <div class="description f2">
        <p>${task.description}</p>
    </div>
  `;
}

/**
 * Generates HTML for task due date section
 * @param {Object} task - Task data object
 * @returns {string} HTML content for due date
 */
function getTaskDetailsContent(task) {
  return `
    <div class="dueDate">
        <p class="f2">Due Date: </p>
        <p class="f2">${displayTaskDueDate(task.dueDate)}</p>
    </div>
  `;
}

/**
 * Generates HTML for task priority section
 * @param {Object} task - Task data object
 * @returns {string} HTML content for priority
 */
function getTaskDetailsPriority(task) {
  return `
    <div class="priority">
        <p class="f2">Priority: </p>
        <p class="f2">${task.prio.charAt(0).toUpperCase() + task.prio.slice(1)}</p>
        <img class="board-task-category" src="./assets/icons/prio-${task.prio}.svg" alt="">
    </div>
  `;
}

/**
 * Generates HTML for assigned contacts section
 * @param {Object} task - Task data object
 * @param {Object} contacts - Contacts data object
 * @returns {string} HTML content for assigned contacts
 */
function getTaskDetailsAssignedTo(task, contacts) {
  return `
    <div class="assignedTo">
        <p class="topAssigned f2">Assigned To:</p>
        <div class="assignedContacts">
            ${displayAssignedTo4TaskDetails(task, contacts)}
        </div>
    </div>
  `;
}

/**
 * Generates HTML for task action buttons
 * @param {string} boardName - Name of the board
 * @param {string} taskId - ID of the task
 * @returns {string} HTML content for action buttons
 */
function getTaskDetailsButtons(boardName, taskId) {
  return `
    <div class="detailsButton">
        <button onclick="doDeleteTask('${boardName}', '${taskId}')" class="endBtn">
            <img class="detailsImgBtn detailsImgBtnDel" src="./assets/icons/delete.svg" alt="">Delete
        </button>
        <button onclick="hideTaskDetails(); showEditTaskDetails('${taskId}')" class="endBtn">
            <img class="detailsImgBtn detailsImgBtnEdit" src="./assets/icons/edit.svg" alt="">Edit
        </button>
    </div>
  `;
}

/**
 * Formats task due date for display
 * @param {string} dueDate - Due date string
 * @returns {string} Formatted date string
 */
function displayTaskDueDate(dueDate) {
  const date = new Date(dueDate);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  let formattedDate = date.toLocaleDateString("de-DE", options);
  return formattedDate;
}

/**
 * Formats task due date for input field
 * @param {string} dueDate - Due date string
 * @returns {string} Date formatted as YYYY-MM-DD
 */
function getTaskDueDate4InputField(dueDate) {
  const date = new Date(dueDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generates HTML for assigned contacts
 * @param {Object} task - Task data object
 * @param {Object} contacts - Contacts data object
 * @returns {string} HTML content for assigned contacts
 */
function displayAssignedTo4TaskDetails(task, contacts) {
  const contactsCount = task && task.assignedTo ? Object.keys(task.assignedTo).length : 0;
  if (contactsCount <= 0) return "";
  let contactsContent = "";
  Object.keys(task.assignedTo).forEach((contactId) => {
    const contact = contacts[contactId];
    if (contact) contactsContent += displayContact4TaskDetails(contact);
  });
  return contactsContent;
}

/**
 * Generates HTML for a single contact
 * @param {Object} contact - Contact data object
 * @returns {string} HTML content for contact
 */
function displayContact4TaskDetails(contact) {
  return `
        <div class="d-flex align-items-center detailsAssignToBox">
            <div class="task-contact task-contact-details f11" style="background: ${contact.avatarColor}">
              ${getShortcutName(contact)}
            </div>
            <p class="f2">${contact.name}</p>
        </div>
        `;
}

/**
 * Generates HTML for subtasks section
 * @param {string} taskId - ID of the task
 * @param {Object} task - Task data object
 * @returns {string} HTML content for subtasks
 */
function displaySubTasks4TaskDetails(taskId, task) {
  const subTasksCount = task && task.subtasks ? Object.keys(task.subtasks).length : 0;
  if (subTasksCount <= 0) return "";
  return `
    <div class="subTasks">
        <p class="topAssigned">Subtasks</p>
        <div class="checkedSubTasks">
            ${getSubtasksContent(taskId, task)}
        </div>
    </div>
  `;
}

/**
 * Generates HTML content for all subtasks
 * @param {string} taskId - ID of the task
 * @param {Object} task - Task data object
 * @returns {string} HTML content for all subtasks
 */
function getSubtasksContent(taskId, task) {
  let subtaskcontent = "";
  Object.keys(task.subtasks).forEach((subtaskId) => {
    const subtask = task.subtasks[subtaskId];
    if (subtask) subtaskcontent += displaySubTask4TaskDetails(taskId, task, subtaskId, subtask);
  });
  return subtaskcontent;
}

/**
 * Generates HTML for a single subtask
 * @param {string} taskId - ID of the task
 * @param {Object} task - Task data object
 * @param {string} subtaskId - ID of the subtask
 * @param {Object} subtask - Subtask data object
 * @returns {string} HTML content for subtask
 */
function displaySubTask4TaskDetails(taskId, task, subtaskId, subtask) {
  return `
        <div class="oneSubTask">
            <input class="task-subtasks-checkbox" type="checkbox" 
              onclick="toggleTaskDone('${taskId}', '${subtaskId}')" ${subtask.done ? "checked" : ""}>
            <p class="f3">${subtask.name}</p>
        </div>
    `;
}

/**
 * Generates HTML for task category type
 * @param {string} category - Category name
 * @returns {string} HTML content for category
 */
function displayTaskType(category) {
  const categoryClass = category.toLowerCase().replace(/\s+/g, '');
  return `<div class="board-task-type task-type-${categoryClass}">${category}</div>`;
}