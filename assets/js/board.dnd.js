let boardFrom;
let taskValue;

/**
 * Starts the dragging process for a task by storing the source board and task identifier.
 *
 * @param {string} board - The identifier of the board from which the task is being dragged.
 * @param {string|number} taskId - The identifier of the task being dragged.
 */
function startTaskDragging(board, taskId) {
    boardFrom = board;
    taskValue = taskId;
}

/**
 * Allows an element to be dropped by preventing the default behavior of the event.
 *
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Moves a task from its original board to a new board.
 * This function removes the task from the source board, adds it to the target board,
 * and then re-renders the tasks.
 *
 * @async
 * @param {string} boardTo - The identifier of the board to which the task should be moved.
 * @returns {Promise<void>} A promise that resolves when the task has been moved.
 */
async function moveTaskTo(boardTo) {
    await removeTaskFromBoard(boardFrom, taskValue);
    await addTaskToBoard(boardTo, taskValue);
    await renderTasks();
}