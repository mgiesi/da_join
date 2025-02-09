const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];

let filterText;

async function initBoard() {
  filterText = "";
  await renderBoardContainer();
  await renderTasks();
}

function updateFilter() {
  const filterInputRef = document.getElementById("board-filter-text");
  filterText = filterInputRef.value;
  renderTasks();
}

function resetFilter() {
  const filterInputRef = document.getElementById("board-filter-text");
  filterInputRef.value = "";
  filterText = "";
  renderTasks();
}

async function renderBoardContainer() {
  const boards = await getBoards();
  const boardContent = document.getElementById("boards-container");
  boardContent.innerHTML = "";
  for (const boardName of boardNames) {
    boardContent.innerHTML += displayBoardContainer(boards[boardName]);
  }
}

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

function toggleAddTaskOverlay() {
  let overlay = document.getElementById("overlayAddTask");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getAddTaskOverlay();
}

function getAddTaskOverlay() {
  return `
  <div class="overlay-addTask">
            
        <div w3-include-html=".\assets\templates\side-menu.html"></div>

        <main class="add-task-content">
            <div class="add-task-header">
                <h1>Add Task</h1>
                <div onclick="toggleAddTaskOverlay()" class="close-btn">×</div>
            </div>

            <form class="add-task-form">
                <div class="form-columns">
                    <div class="form-left-column">
                        <div class="form-group">
                            <label for="title">Title<span class="required">*</span></label>
                            <input type="text" id="title" placeholder="Enter a title" required>
                        </div>

                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" placeholder="Enter a Description"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="assigned">Assigned to</label>
                            <div class="select-wrapper">
                                <select id="assigned">
                                    <option value="">Select contacts to assign</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="separator"></div>

                    <div class="form-right-column">
                        <div class="form-group">
                            <label for="dueDate">Due date<span class="required">*</span></label>
                            <div class="date-input-wrapper">
                                <input type="text" id="dueDate" placeholder="dd/mm/yyyy" pattern="\d{2}/\d{2}/\d{4}"
                                    required maxlength="10" inputmode="numeric">
                                <img src="./assets/icons/calendar.svg" alt="Calendar" class="calendar-icon">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Prio</label>
                            <div class="priority-buttons">
                                <button type="button" class="priority-btn" data-priority="urgent"
                                    onclick="handlePriorityClick(this)">
                                    Urgent
                                    <img src="./assets/icons/prio-urgent.svg" alt="Urgent">
                                </button>
                                <button type="button" class="priority-btn" data-priority="medium"
                                    onclick="handlePriorityClick(this)">
                                    Medium
                                    <img src="./assets/icons/prio-medium.svg" alt="Medium">
                                </button>
                                <button type="button" class="priority-btn" data-priority="low"
                                    onclick="handlePriorityClick(this)">
                                    Low
                                    <img src="./assets/icons/prio-low.svg" alt="Low">
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="category">Category<span class="required">*</span></label>
                            <div class="select-wrapper">
                                <select id="category" required>
                                    <option value="">Select task category</option>
                                    <option value="work">Technical Task</option>
                                    <option value="personal">User Story</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Subtasks</label>
                        <div class="subtask-input">
                            <div class="input-wrapper">
                                <input type="text" id="subtaskInput" placeholder="Add new subtask">
                                <div class="subtask-actions">
                                </div>
                            </div>
                        </div>
                            <div class="subtasks-list"></div>
                        </div>
                    </div>
                </div>
                <div class="footer-add-task-html">
                    <div class="required-note">
                        <span class="required">*</span><span class="span_txt">This field is required</span>
                    </div>
                    <div class="form-actions">
                        <button onclick="toggleAddTaskOverlay()" type="button" class="btn-secondary">
                            Clear
                            <img class="action-btn-img" src="./assets/icons/cancel.svg" alt="Clear form">
                        </button>
                        <button type="submit" class="btn-primary">
                            Create Task
                            <img src="./assets/icons/check.svg" alt="Create task">
                        </button>
                    </div>
                </div>
            </form>
        </main>
    </div>
          </div>
        `;
}
