const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];
const boardTexts = ["To do", "In progress", "Await feedback", "Done"];

/**
 * Initializes the board by setting up search filters, rendering the board container, and resetting the filter.
 * @async
 * @returns {Promise<void>}
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
 * Adapts the add-task functionality for the board context.
 */
function modifyAddTask() {
  addOverlayClickListeners();
  configureCancelButton();
  setAddTaskStyles();
}

/**
 * Configures the cancel button text and behavior.
 */
function configureCancelButton() {
  const btnCancel = document.getElementById("btn-add-task-clear");
  const textNode = findTextNode(btnCancel);
  if (textNode) {
    textNode.textContent = "Cancel";
  }
  btnCancel.onclick = hideOverlays;
}

/**
 * Sets styles for the add task component.
 */
function setAddTaskStyles() {
  document.documentElement.style.setProperty("--footer-add-task-html-bg", "#ffffff");
  document.getElementById("add-task-header").classList.add("dNone");
}

/**
 * Renders the board container with all boards.
 * @async
 * @returns {Promise<void>}
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
 * Renders tasks for each board.
 * @async
 * @returns {Promise<void>}
 */
async function renderTasks() {
  const [boards, tasks, contacts] = await Promise.all([
    getBoards(),
    getTasks(filterText),
    getContacts(),
  ]);
  renderTasksToBoards(boards, tasks, contacts);
  checkResponsiveElements();
  setMoveTaskArrowsVisibility();
}

/**
 * Renders tasks to their respective board containers.
 * @param {Object} boards - The boards data
 * @param {Object} tasks - The tasks data
 * @param {Object} contacts - The contacts data
 */
function renderTasksToBoards(boards, tasks, contacts) {
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