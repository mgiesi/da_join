/**
 * Manages subtask functionality for the add task form
 */

let subtasks = [];
let isEditingSubtask = false;
let editingSubtaskIndex = null;

/**
 * Initializes subtask functionality
 */
function initSubtaskSystem() {
  const subtaskInput = document.getElementById("subtaskInput");
  if (!subtaskInput) return;

  setupSubtaskInput(subtaskInput);
  setupSubtaskInputEvents(subtaskInput);
}

/**
 * Sets up the subtask input field
 * @param {HTMLElement} subtaskInput - The subtask input element
 */
function setupSubtaskInput(subtaskInput) {
  const inputWrapper = subtaskInput.parentElement;
  const actionsDiv = inputWrapper.querySelector(".subtask-actions");
  setDefaultInputActions(actionsDiv);
}

/**
 * Sets default add button for input actions
 * @param {HTMLElement} actionsDiv - The actions container
 */
function setDefaultInputActions(actionsDiv) {
  actionsDiv.innerHTML = `
    <img src="./assets/icons/plus.svg" alt="Add subtask" class="subtask-add-icon" onclick="addSubtask()">
  `;
}

/**
 * Sets up event handlers for the subtask input
 * @param {HTMLElement} subtaskInput - The subtask input element
 */
function setupSubtaskInputEvents(subtaskInput) {
  setupKeyPressEvent(subtaskInput);
  setupFocusEvents(subtaskInput);
}

/**
 * Sets up key press event for subtask input
 * @param {HTMLElement} subtaskInput - The subtask input element
 */
function setupKeyPressEvent(subtaskInput) {
  subtaskInput.onkeypress = function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
  };
}

/**
 * Sets up focus events for subtask input
 * @param {HTMLElement} subtaskInput - The subtask input element
 */
function setupFocusEvents(subtaskInput) {
  subtaskInput.onfocus = function () {
    subtaskInput.placeholder = "";
    transformSubtaskInput(true);
  };

  subtaskInput.onblur = function () {
    if (!subtaskInput.value) {
      subtaskInput.placeholder = "Add new subtask";
    }
  };
}

/**
 * Transforms the subtask input field between adding and editing modes
 * @param {boolean} isEditing - Whether the input is in editing mode
 */
function transformSubtaskInput(isEditing) {
  const subtaskInput = document.getElementById("subtaskInput");
  if (!subtaskInput) return;

  const inputWrapper = subtaskInput.parentElement;
  const actionsDiv = inputWrapper.querySelector(".subtask-actions");

  if (isEditing) {
    setEditingInputActions(actionsDiv, subtaskInput);
  } else {
    resetInputToDefault(actionsDiv, subtaskInput);
  }
}

/**
 * Sets editing mode actions for input
 * @param {HTMLElement} actionsDiv - The actions container
 * @param {HTMLElement} subtaskInput - The subtask input element
 */
function setEditingInputActions(actionsDiv, subtaskInput) {
  actionsDiv.innerHTML = `
    <img src="./assets/icons/cancel.svg" alt="Cancel" class="subtask-cancel-icon" onclick="cancelSubtaskEdit()">
    <div class="subtask-edit-actions-devider"></div>
    <img src="./assets/icons/plus.svg" alt="Confirm" class="subtask-confirm-icon" onclick="addSubtask()">
  `;
  subtaskInput.focus();
}

/**
 * Resets input to default state
 * @param {HTMLElement} actionsDiv - The actions container
 * @param {HTMLElement} subtaskInput - The subtask input element
 */
function resetInputToDefault(actionsDiv, subtaskInput) {
  setDefaultInputActions(actionsDiv);
  subtaskInput.value = "";
  subtaskInput.placeholder = "Add new subtask";
}

/**
 * Cancels the current subtask editing operation
 */
function cancelSubtaskEdit() {
  transformSubtaskInput(false);
}

/**
 * Confirms the current subtask editing operation
 */
function confirmSubtaskEdit() {
  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskText = subtaskInput.value.trim();

  if (subtaskText && editingSubtaskIndex !== null) {
    subtasks[editingSubtaskIndex].name = subtaskText;
    renderSubtasks();
  }

  resetEditState();
}

/**
 * Resets the edit state variables
 */
function resetEditState() {
  transformSubtaskInput(false);
  isEditingSubtask = false;
  editingSubtaskIndex = null;
}

/**
 * Adds a new subtask to the list
 */
function addSubtask() {
  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskText = subtaskInput.value.trim();

  if (subtaskText) {
    addSubtaskToList(subtaskText);
    clearSubtaskInput();
  }
}

/**
 * Adds a subtask to the list
 * @param {string} subtaskText - The text of the subtask
 */
function addSubtaskToList(subtaskText) {
  const subtaskId = "subtask" + (subtasks.length + 1);
  subtasks.push({
    id: subtaskId,
    name: subtaskText,
    done: false,
  });
  renderSubtasks();
}

/**
 * Clears the subtask input field
 */
function clearSubtaskInput() {
  const subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput) {
    subtaskInput.value = "";
    subtaskInput.placeholder = "Add new subtask";
  }
}

/**
 * Renders all subtasks in the subtasks list
 */
function renderSubtasks() {
  const subtasksList = document.querySelector(".subtasks-list");
  if (!subtasksList) return;

  subtasksList.innerHTML = "";
  renderSubtaskItems(subtasksList);
}

/**
 * Renders all subtask items in the list
 * @param {HTMLElement} subtasksList - The subtasks list element
 */
function renderSubtaskItems(subtasksList) {
  for (let i = 0; i < subtasks.length; i++) {
    const subtaskElement = createSubtaskElement(i);
    subtasksList.appendChild(subtaskElement);
  }
}

/**
 * Creates a subtask element
 * @param {number} index - Index of the subtask
 * @returns {HTMLElement} The created subtask element
 */
function createSubtaskElement(index) {
  const subtaskElement = document.createElement("div");
  subtaskElement.className = "subtask-item";

  if (isEditingSubtask && editingSubtaskIndex === index) {
    subtaskElement.innerHTML = createEditableSubtaskHTML(subtasks[index], index);
  } else {
    setupNormalSubtaskElement(subtaskElement, index);
  }

  return subtaskElement;
}

/**
 * Sets up a normal (non-editing) subtask element
 * @param {HTMLElement} element - The subtask element
 * @param {number} index - Index of the subtask
 */
function setupNormalSubtaskElement(element, index) {
  element.innerHTML = createSubtaskHTML(subtasks[index], index);
  element.ondblclick = function () {
    editSubtask(index);
  };
}

/**
 * Creates HTML for a subtask item
 * @param {Object} subtask - Subtask object
 * @param {number} index - Index of the subtask
 * @returns {string} HTML string for subtask item
 */
function createSubtaskHTML(subtask, index) {
  return `
    <div class="subtask-content">
      <span class="subtask-bullet">•</span>
      <span class="subtask-text">${subtask.name}</span>
    </div>
    ${createSubtaskActions(index)}
  `;
}

/**
 * Creates HTML for subtask actions
 * @param {number} index - Index of the subtask
 * @returns {string} HTML string for subtask actions
 */
function createSubtaskActions(index) {
  return `
    <div class="subtask-item-actions">
      <img src="./assets/icons/edit.svg" alt="Edit" onclick="editSubtask(${index})">
      <div class="subtask-edit-actions-devider"></div>
      <img src="./assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(${index})">
    </div>
  `;
}

/**
 * Creates HTML for an editable subtask item
 * @param {Object} subtask - Subtask object
 * @param {number} index - Index of the subtask
 * @returns {string} HTML string for editable subtask item
 */
function createEditableSubtaskHTML(subtask, index) {
  return `
    <div class="subtask-edit-container">
      <input type="text" class="subtask-edit-input" value="${subtask.name}" 
        id="subtask-edit-${index}" spellcheck="true">
      ${createEditableSubtaskActions(index)}
    </div>
  `;
}

/**
 * Creates HTML for editable subtask actions
 * @param {number} index - Index of the subtask
 * @returns {string} HTML string for editable subtask actions
 */
function createEditableSubtaskActions(index) {
  return `
    <div class="subtask-edit-actions">
      <img src="./assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(${index})">
      <div class="subtask-edit-actions-devider"></div>
      <img src="./assets/icons/subtasks_confirm.svg" alt="Save" onclick="saveSubtaskEdit(${index})">
    </div>
  `;
}

/**
 * Edits an existing subtask
 * @param {number} index - Index of the subtask to edit
 */
function editSubtask(index) {
  isEditingSubtask = true;
  editingSubtaskIndex = index;
  renderSubtasks();
  focusEditInput(index);
}

/**
 * Focuses the edit input field
 * @param {number} index - Index of the subtask being edited
 */
function focusEditInput(index) {
  setTimeout(() => {
    const input = document.getElementById(`subtask-edit-${index}`);
    if (input) {
      input.focus();
      input.setSelectionRange(0, input.value.length);
    }
  }, 0);
}

/**
 * Saves the edited subtask
 * @param {number} index - Index of the subtask being edited
 */
function saveSubtaskEdit(index) {
  var editInput = document.getElementById("subtask-edit-" + index);
  var newText = editInput.value.trim();

  if (newText) {
    subtasks[index].name = newText;
  }

  isEditingSubtask = false;
  editingSubtaskIndex = null;
  renderSubtasks();
}

/**
 * Deletes a subtask from the list
 * @param {number} index - Index of the subtask to delete
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);

  if (isEditingSubtask && editingSubtaskIndex === index) {
    isEditingSubtask = false;
    editingSubtaskIndex = null;
  }

  renderSubtasks();
}

/**
 * Gets the current subtasks array for task creation
 * @returns {Array} Array of subtask objects
 */
function getSubtasks() {
  return subtasks.map((subtask) => ({
    id: subtask.id,
    name: subtask.name,
    done: subtask.done,
  }));
}

/**
 * Resets the subtasks array to an empty state
 */
function resetSubtasks() {
  subtasks = [];
  renderSubtasks();
}