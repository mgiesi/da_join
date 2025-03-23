/** Defines the maximum showing contacts in the board-task-card */
const maxContactsOnCard = 6;

/**
 * Creates HTML for a board container
 * @param {Object} board - The board object
 * @returns {string} HTML string for the board container
 */
function displayBoardContainer(board) {
  let addTaskContent = board.addtasks
    ? `<div onclick="showAddTaskOverlay('${board.id}')" class="board-container-titlebox-addtask d-flex justify-content-center align-items-center">+</div>`
    : "";
  return `
        <div class="board-container" ondrop="moveTaskTo(event, '${board.id}')" ondragover="allowDrop(event)">
            <div class="board-container-titlebox d-flex justify-content-between align-items-center">
                <span class="board-container-titlebox-title f10">${board.name}</span>
                ${addTaskContent}
            </div>
            <div id="board-container-${board.id}" class="board-container-tasks"></div>
        </div>
    `;
}

/**
 * Determines whether to display tasks or empty board message
 * @param {Object} board - The board object
 * @param {Object} tasks - All tasks
 * @param {Object} contacts - All contacts
 * @returns {string} HTML string for board tasks
 */
function displayBoardTasks(board, tasks, contacts) {
  const taskKeys =
    board && board.tasks
      ? Object.keys(board.tasks).filter((key) => key !== "undefined")
      : [];
  const taskCount = taskKeys.length;
  return taskCount <= 0
    ? displayEmptyBoard(board)
    : displayTasks(board, tasks, contacts);
}

/**
 * Creates HTML for an empty board
 * @param {Object} board - The board object
 * @returns {string} HTML string for empty board
 */
function displayEmptyBoard(board) {
  return `
    <div class="board-tasks-notasks d-flex justify-content-center align-items-center f3">
        No tasks ${board.name}
    </div>
  `;
}

/**
 * Creates HTML for all tasks in a board
 * @param {Object} board - The board object
 * @param {Object} tasks - All tasks
 * @param {Object} contacts - All contacts
 * @returns {string} HTML string for tasks
 */
function displayTasks(board, tasks, contacts) {
  let htmlContent = "";
  Object.keys(board.tasks).forEach((taskId) => {
    const task = tasks[taskId];
    if (task === undefined || task === null) return;
    htmlContent += createTaskCard(board.id, taskId, task, contacts);
  });
  return htmlContent;
}

/**
 * Creates HTML for a single task card
 * @param {string} boardId - The board ID
 * @param {string} taskId - The task ID
 * @param {Object} task - The task object
 * @param {Object} contacts - All contacts
 * @returns {string} HTML string for task card
 */
function createTaskCard(boardId, taskId, task, contacts) {
  return `
    <div onclick="showTaskDetails('${boardId}', '${taskId}')" class="board-task-container" 
         draggable="true" ondragstart="startTaskDragging('${boardId}', '${taskId}')">
        ${createTaskCardHeader(task, taskId)}
        ${createTaskCardBody(task)}
        ${displaySubTasks(task)}
        ${createTaskCardFooter(task, contacts)}
        ${createMoveTaskOverlay(boardId, taskId)}
    </div>
  `;
}

/**
 * Creates the header section of a task card
 * @param {Object} task - The task object
 * @param {string} taskId - The task ID
 * @returns {string} HTML string for task card header
 */
function createTaskCardHeader(task, taskId) {
  return `
    <div class="d-flex justify-content-between mb-24">
        ${displayTaskType(task.category)}
        <img onclick="toggleMoveTaskOverlay(event, 'board-task-overlay-${taskId}')" 
             class="board-task-movetask" src="./assets/icons/arrow_down.svg"/>
    </div>
  `;
}

/**
 * Creates the body section of a task card
 * @param {Object} task - The task object
 * @returns {string} HTML string for task card body
 */
function createTaskCardBody(task) {
  return `
    <div class="mb-24">
        <div class="mb-8">
            <span class="board-task-title f9">${task.title}</span>
        </div>
        <p class="board-task-descr f3">${task.description}</p>
    </div>
  `;
}

/**
 * Creates the footer section of a task card
 * @param {Object} task - The task object
 * @param {Object} contacts - All contacts
 * @returns {string} HTML string for task card footer
 */
function createTaskCardFooter(task, contacts) {
  return `
    <div class="board-task-footer d-flex justify-content-between">
        <div class="board-task-contacts">
            ${displayAssignedTo(task, contacts)}
        </div>
        <img class="board-task-category" src="./assets/icons/prio-${task.prio}.svg" alt="">
    </div>
  `;
}

/**
 * Creates the move task overlay for a task card
 * @param {string} boardId - The board ID
 * @param {string} taskId - The task ID
 * @returns {string} HTML string for move task overlay
 */
function createMoveTaskOverlay(boardId, taskId) {
  return `
    <div id="board-task-overlay-${taskId}" class="board-task-move-overlay d-flex dNone">
        <div class="d-flex justify-content-between">
          <div class="f9">Move task to...</div>
          <img onclick="toggleMoveTaskOverlay(event, 'board-task-overlay-${taskId}')" 
               class="board-task-movetask-2" src="./assets/icons/arrow_down.svg"/>
        </div>
        ${displayMoveToElements(boardId, taskId)}
    </div>
  `;
}

/**
 * Creates HTML for move-to options
 * @param {string} boardId - Current board ID
 * @param {string} taskId - The task ID
 * @returns {string} HTML string for move-to options
 */
function displayMoveToElements(boardId, taskId) {
  let htmlContent = "";
  for (let index = 0; index < boardNames.length; index++) {
    const boardName = boardNames[index];
    if (boardName === boardId) continue;
    htmlContent += `<p class="f10" onclick="startTaskDragging('${boardId}', '${taskId}'); moveTaskTo(event, '${boardName}')">- ${boardTexts[index]}</p>`;
  }
  return htmlContent;
}

/**
 * Creates HTML for task type badge
 * @param {string} taskCategory - The task category
 * @returns {string} HTML string for task type badge
 */
function displayTaskType(taskCategory) {
  if ("userstory" === taskCategory) {
    return `<div class="board-task-type task-type-userstory f3">User Story</div>`;
  } else {
    return `<div class="board-task-type task-type-task f3">Technical Task</div>`;
  }
}

/**
 * Creates HTML for subtasks progress bar
 * @param {Object} task - The task object
 * @returns {string} HTML string for subtasks section
 */
function displaySubTasks(task) {
  const subTasksCount = task?.subtasks ? Object.keys(task.subtasks).length : 0;
  if (subTasksCount <= 0) return "";

  const subTasksDone = getSubTasksDoneCount(task, subTasksCount);
  const subTasksDonePercent = (subTasksDone / subTasksCount) * 100;
  return createSubtasksProgressBar(subTasksDone, subTasksCount, subTasksDonePercent);
}

/**
 * Creates HTML for subtasks progress bar
 * @param {number} done - Number of completed subtasks
 * @param {number} total - Total number of subtasks
 * @param {number} percent - Percentage of completed subtasks
 * @returns {string} HTML string for subtasks progress bar
 */
function createSubtasksProgressBar(done, total, percent) {
  return `
    <div class="board-task-subtasks mb-24 d-flex align-items-center tooltip">
        <div class="board-subtasks-bar">
            <div style="width: ${percent}%" class="board-subtasks-bar-value"></div>
        </div>
        <span class="f11">${done}/${total} Subtasks</span>
        <span class="tooltiptext">${done} of ${total} subtasks done</span>
    </div>
  `;
}

/**
 * Counts completed subtasks
 * @param {Object} task - The task object
 * @param {number} subTasksCount - Total number of subtasks
 * @returns {number} Count of completed subtasks
 */
function getSubTasksDoneCount(task) {
  let subTasksDoneCount = 0;
  Object.keys(task.subtasks).forEach((subtaskId) => {
    if (task.subtasks[subtaskId].done) {
      subTasksDoneCount++;
    }
  });
  return subTasksDoneCount;
}

/**
 * Creates HTML for assigned contacts
 * @param {Object} task - The task object
 * @param {Object} contacts - All contacts
 * @returns {string} HTML string for assigned contacts
 */
function displayAssignedTo(task, contacts) {
  const contactsCount = task?.assignedTo ? Object.keys(task.assignedTo).length : 0;
  if (contactsCount <= 0) return "";

  return createContactsDisplay(task, contacts);
}

/**
 * Creates HTML for contact avatars
 * @param {Object} task - The task object
 * @param {Object} contacts - All contacts
 * @returns {string} HTML string for contact avatars
 */
function createContactsDisplay(task, contacts) {
  let contactsContent = "";
  let displayedContacts = 0;

  Object.keys(task.assignedTo).forEach((contactId) => {
    const contact = contacts[contactId];
    if (!contact) return;

    displayedContacts++;
    if (displayedContacts < maxContactsOnCard) {
      contactsContent += displayContact(contact);
    }
  });

  contactsContent += displayContactCount(displayedContacts);
  return contactsContent;
}

/**
 * Creates HTML for additional contacts count
 * @param {number} displayedContacts - Number of contacts to display
 * @returns {string} HTML string for additional contacts count
 */
function displayContactCount(displayedContacts) {
  if (displayedContacts < maxContactsOnCard) return "";

  return `
    <div class="task-contact f11" style="background: ${getRandomColor()}">+${displayedContacts - maxContactsOnCard + 1
    }</div>
  `;
}

/**
 * Creates HTML for a contact avatar
 * @param {Object} contact - The contact object
 * @returns {string} HTML string for contact avatar
 */
function displayContact(contact) {
  return `
    <div class="task-contact f11" style="background: ${contact.avatarColor
    }">${getShortcutName(contact)}</div>
  `;
}

/**
 * Checks screen size and hides responsive X if needed
 */
function checkResponsiveElements() {
  if (window.innerWidth >= 1081) {
    const ref = document.querySelector(".respX");
    if (ref) ref.style.display = "none";
  }
}

/**
 * Sets visibility of move task arrows based on screen width
 */
function setMoveTaskArrowsVisibility() {
  const elements = document.querySelectorAll(".board-task-movetask");
  const isVisible = window.innerWidth < 1500;
  elements.forEach(element => {
    element.style.display = isVisible ? "block" : "none";
  });
}

/**
 * Initialize responsive elements
 */
window.onload = function () {
  checkResponsiveElements();
  setMoveTaskArrowsVisibility();
  window.onresize = function () {
    checkResponsiveElements();
    setMoveTaskArrowsVisibility();
  };
};