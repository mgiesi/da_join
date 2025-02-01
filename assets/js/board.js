async function initBoard() {
    cleanBoardView();
    const boardNames = ["todo", "inprogress", "awaitfeedback", "done"];
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