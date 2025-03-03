const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];

let filterText;

/**
 * Initializes the board by setting up search filters, rendering the board container, and resetting the filter.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the board initialization is complete.
 */
async function initBoard() {
  initSearchFilter();
  await renderBoardContainer();
  resetFilter();
  modifyAddTask();
}

function modifyAddTask() {
  addOverlayClickListeners();
  const btnCancel = document.getElementById('btn-add-task-clear');
  btnCancel.innerHTML = "Cancel";
  btnCancel.onclick = hideOverlays;
}

function addOverlayClickListeners() {
  const overlays = document.querySelectorAll('.overlay-background');
  overlays.forEach(function(overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) {
        hideOverlays();
      }
    });
  });
}

/**
 * Initializes the search filter by adding input event listeners to the filter text elements.
 */
function initSearchFilter() {
  const filterInputRef = document.getElementById("board-filter-text");
  filterInputRef.addEventListener("input", updateFilterIcon);
  const filterInput2Ref = document.getElementById("board-filter-text2");
  filterInput2Ref.addEventListener("input", updateFilterIcon);
}

/**
 * Updates the filter icons for both filter input fields based on whether they contain a value.
 */
function updateFilterIcon() {
  const filterInputRef = document.getElementById("board-filter-text");
  const filterInputIconRef = document.getElementById("board-filter-text-icon");  
  const filterInput2Ref = document.getElementById("board-filter-text2");
  const filterInputIcon2Ref = document.getElementById("board-filter-text-icon2");
  filterInputIconRef.src = filterInputRef.value
    ? "./assets/icons/cancel.svg"
    : "./assets/icons/search.svg";
  filterInputIcon2Ref.src = filterInput2Ref.value
    ? "./assets/icons/cancel.svg"
    : "./assets/icons/search.svg";
}

/**
 * Updates the board filter based on user input.
 * Synchronizes the filter text between two input fields, updates the filter icon, and re-renders tasks.
 *
 * @param {Event} event - The input event triggered by the filter text change.
 */
function updateFilter(event) {
  const filterInputRef = document.getElementById("board-filter-text");
  const filterInput2Ref = document.getElementById("board-filter-text2");
  filterText = event.target.value;
  filterInputRef.value = filterText;
  filterInput2Ref.value = filterText;
  updateFilterIcon();
  renderTasks();
}

/**
 * Resets the board filter by clearing both filter input fields, updating the filter icon, and re-rendering tasks.
 */
function resetFilter() {
  const filterInputRef = document.getElementById("board-filter-text");
  const filterInput2Ref = document.getElementById("board-filter-text2");
  filterInputRef.value = "";
  filterInput2Ref.value = "";
  filterText = "";
  updateFilterIcon();
  renderTasks();
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
function toggleAddTaskOverlay() {
  let overlay = document.getElementById("overlayAddTask");
  overlay.classList.toggle("dNone");
}

/**
 * Shows the add task overlay.
 * 
 * @param {string} boardName name of the board where to add the new task
 */
function showAddTaskOverlay(boardName) {
  addTaskToBoardName = boardName;
  let overlay = document.getElementById("overlayAddTask");
  overlay.classList.remove("dNone");
}

/**
 * Hides all overlays.
 */
function hideOverlays() {
  const overlays = document.querySelectorAll('.overlay-background');
  overlays.forEach(function(overlay) {
    overlay.classList.add("dNone");
  });
}

/**
 * Toggles the task details overlay for a given task.
 * Fetches the task and contacts data, then updates the overlay content with the task details.
 *
 * @async
 * @param {string|number} taskId - The identifier of the task.
 * @returns {Promise<void>} A promise that resolves when the task details overlay has been toggled.
 */
async function toggleTaskDetails(taskId) {
  const [task, contacts] = await Promise.all([getTask(taskId), getContacts()]);

  let overlay = document.getElementById("taskDetails");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getTaskDetails(taskId, task, contacts);
}

/**
 * Toggles the edit task details overlay for a given task.
 * Fetches the task and contacts data, then updates the overlay content with the edit task template.
 *
 * @async
 * @param {string|number} taskId - The identifier of the task to be edited.
 * @returns {Promise<void>} A promise that resolves when the edit task details overlay has been toggled.
 */
async function toggleEditTaskDetails(taskId) {
  const [task, contacts] = await Promise.all([getTask(taskId), getContacts()]);

  let overlay = document.getElementById("editTaskDetails");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getEditTaskDetails(taskId, task, contacts);
}

async function doDeleteTask(taskId) {
  await deleteTask(taskId);
  renderTasks();
  toggleTaskDetails();
  showDeleteMessage()
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