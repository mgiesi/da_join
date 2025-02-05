const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];

let dragStartBoard;
let dragStartTask;

async function initBoard() {
    cleanBoardView();
    for (const boardName of boardNames) {
        await readBoardContent(boardName);
    }
}

function cleanBoardView() {
    const boardContent = document.getElementById("boards-container");
    boardContent.innerHTML = "";
}

async function readBoardContent(boardName) {
    const boardContent = document.getElementById("boards-container");
    const board = await getBoard(boardName);

    boardContent.innerHTML += await displayBoard(board);
}

function startTaskDragging(board, taskId) {
    dragStartBoard = board;
    dragStartTask = taskId;
}

function allowDrop(event) {
    event.preventDefault();
}

function moveTaskTo(board) {
    if (!board || dragTask === undefined || dragTask === null) {
        return;
    }

    let tasks = board.tasks;
    if (!(task))
}