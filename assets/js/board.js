const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];

async function initBoard() {
    cleanBoardView();
    const boards = await getBoards();
    const tasks = await getTasks();
    const contacts = await getContacts();
    for (const boardName of boardNames) {
        readBoardContent(boards[boardName], tasks, contacts);
    }
}

function cleanBoardView() {
    const boardContent = document.getElementById("boards-container");
    boardContent.innerHTML = "";
}

function readBoardContent(board, tasks, contacts) {
    const boardContent = document.getElementById("boards-container");

    boardContent.innerHTML += displayBoard(board, tasks, contacts);
}
