const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];

let filterText;

async function initBoard() {
    initSearchFilter();
    await renderBoardContainer();
    resetFilter();
}

function initSearchFilter() {
    const filterInputRef = document.getElementById("board-filter-text");
    filterInputRef.addEventListener("input", updateFilterIcon);
}

function updateFilterIcon() {
    const filterInputRef = document.getElementById("board-filter-text");
    const filterInputIconRef = document.getElementById("board-filter-text-icon");
    filterInputIconRef.src = filterInputRef.value ? "./assets/icons/cancel.svg" : "./assets/icons/search.svg";
}

function updateFilter() {
    const filterInputRef = document.getElementById("board-filter-text");
    filterText = filterInputRef.value;
    updateFilterIcon();
    renderTasks();
}

function resetFilter() {
    const filterInputRef = document.getElementById("board-filter-text");
    filterInputRef.value = "";
    filterText = "";
    updateFilterIcon();
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

async function toggleTaskDetails(taskId) {
    const [task, contacts] = await Promise.all([
        getTask(taskId),
        getContacts(),
    ]);

    let overlay = document.getElementById("taskDetails");
    overlay.classList.toggle("dNone");
    overlay.innerHTML = getTaskDetails(task, contacts);
}
