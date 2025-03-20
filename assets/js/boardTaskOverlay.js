/**
 * Functions for managing task overlays in the board
 */

/**
 * Shows the specified overlay and opens the modal.
 * @param {string} overlayId - The ID of the overlay to show
 */
function showOverlay(overlayId) {
    let overlay = document.getElementById(overlayId);
    overlay.classList.remove("dNone");
    openModal();
}

/**
 * Hides the specified overlay and closes the modal.
 * @param {string} overlayId - The ID of the overlay to hide
 */
function hideOverlay(overlayId) {
    let overlay = document.getElementById(overlayId);
    overlay.classList.add("dNone");
    closeModal();
}

/**
 * Hides all overlays.
 */
function hideOverlays() {
    const overlays = document.querySelectorAll(".overlay-background");
    overlays.forEach(function (overlay) {
        overlay.classList.add("dNone");
    });
    closeModal();
}

/**
 * Adds click listeners to overlays for closing when clicking outside.
 */
function addOverlayClickListeners() {
    const overlays = document.querySelectorAll(".overlay-background");
    overlays.forEach(function (overlay) {
        overlay.addEventListener("click", function (e) {
            if (e.target === this) {
                hideOverlays();
            }
        });
    });
}

/**
 * Shows the add task overlay.
 */
function showAddTaskOverlay() {
    configureSubmitButton("Create Task");
    showCategoryGroup();
    setupAddTaskForm();
    showOverlay("overlayAddTask");
}

/**
 * Shows the add task overlay for a specific board.
 * @param {string} boardName - The board to add the task to
 */
function showAddTaskOverlay(boardName) {
    addTaskToBoardName = boardName;
    configureSubmitButton("Create Task");
    showCategoryGroup();
    setupAddTaskForm();
    showOverlay("overlayAddTask");
}

/**
 * Hides the add task overlay.
 */
function removeAddTaskOverlay() {
    configureSubmitButton("Create Task");
    setupAddTaskForm();
    hideOverlay("overlayAddTask");
}

/**
 * Shows a delete confirmation message.
 */
function showDeleteMessage() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("dNone");
    overlay.classList.add("animate");
    setTimeout(function () {
        overlay.classList.add("dNone");
    }, 2000);
}

/**
 * Toggles the visibility of the move task overlay.
 * @param {Event} event - The triggering event
 * @param {string} elementId - The overlay element ID
 */
function toggleMoveTaskOverlay(event, elementId) {
    event.stopPropagation();
    hideMoveTaskOverlays(elementId);
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle("dNone");
    }
}

/**
 * Hides all move task overlays except the specified one.
 * @param {string} elementId - The ID of the overlay to keep visible
 */
function hideMoveTaskOverlays(elementId) {
    const overlays = document.querySelectorAll(".board-task-move-overlay");
    overlays.forEach(function (overlay) {
        if (overlay.id === elementId) {
            return;
        }
        overlay.classList.add("dNone");
    });
}
