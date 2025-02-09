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


