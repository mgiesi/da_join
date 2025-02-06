const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];

async function initBoard() {
    await renderBoardContainer();
    await renderTasks();
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
        getTasks(),
        getContacts()
    ]);
    for (const boardName of boardNames) {
        const boardContent = document.getElementById("board-container-" + boardName);
        boardContent.innerHTML = displayBoardTasks(boards[boardName], tasks, contacts);
    }
}
