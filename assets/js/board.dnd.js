let boardFrom;
let taskValue;

function startTaskDragging(board, taskId) {
    boardFrom = board;
    taskValue = taskId;
}

function allowDrop(event) {
    event.preventDefault();
}

async function moveTaskTo(boardTo) {
    await removeTaskFromBoard(boardFrom, taskValue);
    await addTaskToBoard(boardTo, taskValue);
    await renderTasks();
}