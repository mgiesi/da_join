const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];
const boardTexts = ["To do", "In progress", "Await feedback", "Done"];

/**
 * Initializes the board by setting up search filters, rendering the board container, and resetting the filter.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the board initialization is complete.
 */
async function initBoard() {
  await initAddTask();
  initSearchFilter();
  await renderBoardContainer();
  resetFilter();
  initBoardDragAndDrop();
  modifyAddTask();
}

/**
 * Because of importing the add-task.html content, we have to addapt some
 * basic functions from the original page.
 */
function modifyAddTask() {
  addOverlayClickListeners();
  const btnCancel = document.getElementById("btn-add-task-clear");
  const textNode = Array.from(btnCancel.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
  );
  if (textNode) {
    textNode.textContent = "Cancel";
  }
  btnCancel.onclick = hideOverlays;

  document.documentElement.style.setProperty("--footer-add-task-html-bg", "#ffffff");
  document.getElementById("add-task-header").classList.add("dNone");
}

/**
 * Adds an click listener to the overlay content.
 * The overlay will automatically removed, when operator clicks outside
 * of the overlay.
 */
function addOverlayClickListeners() {
  const overlays = document.querySelectorAll(".overlay-background");
  overlays.forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) {
        hideOverlays();
      }
    });
  });
}

/**
 * Renders the board container by fetching board data and inserting the generated HTML for each board.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the board container has been rendered.
 */
async function renderBoardContainer() {
  const boards = await getBoards();
  const boardContent = document.getElementById("boards-container");
  boardContent.innerHTML = "";
  for (const boardName of boardNames) {
    boardContent.innerHTML += displayBoardContainer(boards[boardName]);
  }
}

/**
 * Renders tasks for each board by fetching boards, tasks (filtered by filterText), and contacts data,
 * then inserting the generated HTML into each board container.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when tasks have been rendered on all boards.
 */
async function renderTasks() {
  const [boards, tasks, contacts] = await Promise.all([
    getBoards(),
    getTasks(filterText),
    getContacts(),
  ]);
  for (const boardName of boardNames) {
    const boardContent = document.getElementById(
      "board-container-" + boardName
    );
    boardContent.innerHTML = displayBoardTasks(
      boards[boardName],
      tasks,
      contacts
    );
  }
}

/**
 * Toggles the visibility of the add task overlay.
 * Updates the overlay content with the add task overlay template.
 */
function showAddTaskOverlay() {
  const btnSubmit = document.getElementById("btn-add-task-submit");
  const textNode = Array.from(btnSubmit.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
  );
  if (textNode) {
    textNode.textContent = "Create Task";
  }
  document.getElementById("form-group-category").classList.remove("dNone");
  const addTaskForm = document.getElementById("add-task-form");
  addTaskForm.onsubmit = handleFormSubmit;
  resetEditTaskContent();
  let overlay = document.getElementById("overlayAddTask");
  overlay.classList.remove("dNone");
  openModal();
}

/**
 * Removed the visibility of the add task overlay.
 */
function removeAddTaskOverlay() {
  const btnSubmit = document.getElementById("btn-add-task-submit");
  const textNode = Array.from(btnSubmit.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
  );
  if (textNode) {
    textNode.textContent = "Create Task";
  }
  const addTaskForm = document.getElementById("add-task-form");
  addTaskForm.onsubmit = handleFormSubmit;
  resetEditTaskContent();
  let overlay = document.getElementById("overlayAddTask");
  overlay.classList.add("dNone");
  closeModal();
}

/**
 * Shows the add task overlay.
 *
 * @param {string} boardName name of the board where to add the new task
 */
function showAddTaskOverlay(boardName) {
  addTaskToBoardName = boardName;

  const btnSubmit = document.getElementById("btn-add-task-submit");
  const textNode = Array.from(btnSubmit.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
  );
  if (textNode) {
    textNode.textContent = "Create Task";
  }
  document.getElementById("form-group-category").classList.remove("dNone");
  const addTaskForm = document.getElementById("add-task-form");
  addTaskForm.onsubmit = handleFormSubmit;
  resetEditTaskContent();
  let overlay = document.getElementById("overlayAddTask");
  overlay.classList.remove("dNone");
  openModal();
}

/**
 * Hides all overlays.
 */
function hideOverlays() {
  const overlays = document.querySelectorAll(".overlay-background");
  overlays.forEach(function (overlay) {
    overlay.classList.add("dNone");
  });
  closeModal();
}

/**
 * Shows the task details overlay for a given task.
 * Fetches the task and contacts data, then updates the overlay content with the task details.
 *
 * @async
 * @param {string|boardName} boardName - Name of the board which this task belongs to
 * @param {string|number} taskId - The identifier of the task.
 * @returns {Promise<void>} A promise that resolves when the task details overlay has been toggled.
 */
async function showTaskDetails(boardName, taskId) {
  let overlay = document.getElementById("taskDetails");
  resetEditTaskContent();
  const [task, contacts] = await Promise.all([getTask(taskId), getContacts()]);
  overlay.innerHTML = getTaskDetails(taskId, task, contacts, boardName);
  overlay.classList.remove("dNone");
  openModal();
}

/**
 * Hides the task details overlay.
 */
function hideTaskDetails() {
  let overlay = document.getElementById("taskDetails");
  overlay.classList.add("dNone");
  closeModal();
}

/**
 * Shows the edit task details overlay for a given task.
 * Fetches the task and contacts data, then updates the overlay content with the edit task template.
 *
 * @async
 * @param {string|number} taskId - The identifier of the task to be edited.
 * @returns {Promise<void>} A promise that resolves when the edit task details overlay has been toggled.
 */
async function showEditTaskDetails(taskId) {
  let overlay = document.getElementById("overlayAddTask");
  
  document.getElementById("form-group-category").classList.add("dNone");
  const [task, contacts] = await Promise.all([getTask(taskId), getContacts()]);

  loadTaskEditContent(taskId, task, contacts);
  const addTaskForm = document.getElementById("add-task-form");
  addTaskForm.onsubmit = function (event) {
    handleFormSubmit4Edit(event, taskId);
  };
  const btnSubmit = document.getElementById("btn-add-task-submit");
  const textNode = Array.from(btnSubmit.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
  );
  if (textNode) {
    textNode.textContent = "Ok";
  }
  overlay.classList.remove("dNone");
  openModal();
}

/**
 * Hides the edit task details overlay.
 */
function hideEditTaskDetails() {
  let overlay = document.getElementById("overlayAddTask");
  overlay.classList.add("dNone");
  document.getElementById("form-group-category").classList.remove("dNone");
  closeModal();
}

/**
 * Delets a task with the given task id.
 *
 * @async
 * @param {string} boardName name of the board which this task belongs to
 * @param {string} taskId task id for the tast which should be deleted
 */
async function doDeleteTask(boardName, taskId) {
  await deleteTask(taskId);
  await removeTaskFromBoard(boardName, taskId);
  renderTasks();
  hideTaskDetails();
  showDeleteMessage();
}

/**
 * Shows a information message as toast when deleting a task.
 */
function showDeleteMessage() {
  document.getElementById("overlay").classList.remove("dNone");
  overlay.classList.add("animate");
  setTimeout(function () {
    overlay.classList.add("dNone");
  }, 2000);
}

/**
 * Shows a overlay to move a task from one board to another.
 */
function toggleMoveTaskOverlay(event, elementId) {
  event.stopPropagation();
  hideMoveTaskOverlays(elementId);
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.toggle("dNone");
  }
}

/**
 * Hides all move-task-to overlays on the board.
 * 
 * @param {string} elementId 
 */
function hideMoveTaskOverlays(elementId) {
  const overlays = document.querySelectorAll(".board-task-move-overlay");
  overlays.forEach(function (overlay) {
    if (overlay.id === elementId) {
      return;
    }
    overlay.classList.add("dNone");
  });
}

/**
 * Loads the task details for the edit-task overlay.
 * 
 * @param {string} taskId 
 * @param {object} task 
 * @param {object} contactsFromDb 
 */
function loadTaskEditContent(taskId, task, contactsFromDb) {
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("dueDate").value = getTaskDueDate4InputField(task.dueDate);

  if (task.prio === "urgent") {
    document.getElementById("add-task-btn-urgent").classList.add("active", "selected");
  } else {
    document.getElementById("add-task-btn-urgent").classList.remove("active", "selected");
  }
  if (task.prio === "medium") {
    document.getElementById("add-task-btn-medium").classList.add("active", "selected");
  } else {
    document.getElementById("add-task-btn-medium").classList.remove("active", "selected");
  }
  if (task.prio === "low") {
    document.getElementById("add-task-btn-low").classList.add("active", "selected");
  } else {
    document.getElementById("add-task-btn-low").classList.remove("active", "selected");
  }
  
  document.getElementById("categorySelected").setAttribute("data-value", task.category === "userstory" ? "personal" : "work");
  document.getElementById("category").value = task.category === "userstory" ? "User Story" : "Technical Task";
  
  selectedContacts = [];
  const contactsCount = task && task.assignedTo ? Object.keys(task.assignedTo).length : 0;
  if (contactsCount > 0) {
    Object.keys(task.assignedTo).forEach((contactId) => {
      selectedContacts.push(contactId);
    });
  }
  updateSelectedAvatars();
  
  subtasks = [];
  const subTasksCount =
    task && task.subtasks ? Object.keys(task.subtasks).length : 0;
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
 * Resets the input fields of the task details overlay.
 */
function resetEditTaskContent() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("dueDate").value = "";

  document.getElementById("add-task-btn-urgent").classList.remove("active", "selected");
  document.getElementById("add-task-btn-medium").classList.add("active", "selected");
  document.getElementById("add-task-btn-low").classList.remove("active", "selected");

  selectedContacts = [];
  updateSelectedAvatars();
    
  subtasks = [];
  renderSubtasks();
}
