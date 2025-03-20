let boardFrom;
let taskValue;

/**
 * Initializes drag and drop functionality for all board containers.
 * Sets up event listeners for drag enter, leave, drop, and dragover events.
 */
function initBoardDragAndDrop() {
    const boardContainers = document.querySelectorAll('.board-container');
    boardContainers.forEach(boardContainer => {
        boardContainer.dragCounter = 0;
        setupDragEventListeners(boardContainer);
    });
}

/**
 * Sets up drag and drop event listeners for a specific board container.
 * 
 * @param {HTMLElement} boardContainer - The board container element to set up events for.
 */
function setupDragEventListeners(boardContainer) {
    boardContainer.addEventListener('dragenter', handleDragEnter);
    boardContainer.addEventListener('dragleave', handleDragLeave);
    boardContainer.addEventListener('drop', handleDrop);
    boardContainer.addEventListener('dragover', handleDragOver);
}

/**
 * Handles the dragenter event for board containers.
 * Increments the drag counter and adds the dragged class.
 * 
 * @param {DragEvent} e - The drag event.
 */
function handleDragEnter(e) {
    e.preventDefault();
    this.dragCounter++;
    this.classList.add("board-container-dragged");
}

/**
 * Handles the dragleave event for board containers.
 * Decrements the drag counter and removes the dragged class if counter reaches zero.
 * 
 * @param {DragEvent} e - The drag event.
 */
function handleDragLeave(e) {
    e.preventDefault();
    this.dragCounter--;
    if (this.dragCounter === 0) {
        this.classList.remove("board-container-dragged");
    }
}

/**
 * Handles the drop event for board containers.
 * Resets the drag counter and removes the dragged class.
 * 
 * @param {DragEvent} e - The drag event.
 */
function handleDrop(e) {
    e.preventDefault();
    this.dragCounter = 0;
    this.classList.remove("board-container-dragged");
}

/**
 * Handles the dragover event for board containers.
 * Prevents the default behavior to allow dropping.
 * 
 * @param {DragEvent} e - The drag event.
 */
function handleDragOver(e) {
    e.preventDefault();
}

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
 * @param {DragEvent} event - The drag event.
 * @param {string} boardTo - The identifier of the board to which the task should be moved.
 * @returns {Promise<void>} A promise that resolves when the task has been moved.
 */
async function moveTaskTo(event, boardTo) {
    event.stopPropagation();
    await removeTaskFromBoard(boardFrom, taskValue);
    await addTaskToBoard(boardTo, taskValue);
    await renderTasks();
}