/**
 * Manages subtask functionality for the add task form
 */

let subtasks = [];
let isEditingSubtask = false;

/**
 * Initializes subtask functionality
 */
function initSubtaskSystem() {
  const subtaskInput = document.getElementById("subtaskInput");
  if (!subtaskInput) return;

  const inputWrapper = subtaskInput.parentElement;
  const actionsDiv = inputWrapper.querySelector(".subtask-actions");

  actionsDiv.innerHTML = `
       <img src="./assets/icons/Subtasks\ icons11.svg" alt="Add subtask" class="subtask-add-icon" onclick="focusSubtaskInput()">
   `;

  subtaskInput.onkeypress = function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
  };

  subtaskInput.onfocus = function () {
    transformSubtaskInput(true);
  };
}

/**
 * Transforms the subtask input field to show action buttons
 * @param {boolean} isFocused - Whether the input is focused
 */
function transformSubtaskInput(isFocused) {
  const subtaskInput = document.getElementById("subtaskInput");
  const inputWrapper = subtaskInput.parentElement;
  const actionsDiv = inputWrapper.querySelector(".subtask-actions");

  if (isFocused) {
    subtaskInput.style.backgroundImage = 'none';
    actionsDiv.innerHTML = `
      <div class="edit-actions active">
        <img src="./assets/icons/cancel.svg" alt="Cancel" onclick="clearSubtaskInput()">
        <div class="vertical-divider"></div>
        <img src="./assets/icons/subtasks_confirm.svg" alt="Confirm" class="" onclick="addSubtask()">
      </div>
    `;
    subtaskInput.classList.add('active');
  } else {
    subtaskInput.style.backgroundImage = '';
    actionsDiv.innerHTML = `
      <img src="./assets/icons/Subtasks\ icons11.svg" alt="Add subtask" class="subtask-add-icon" onclick="focusSubtaskInput()">
    `;
    subtaskInput.classList.remove('active');
  }
}

/**
 * Focuses the subtask input field
 */
function focusSubtaskInput() {
  const subtaskInput = document.getElementById("subtaskInput");
  subtaskInput.focus();
}

/**
 * Adds a new subtask to the list
 */
function addSubtask() {
  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskText = subtaskInput.value.trim();

  if (subtaskText) {
    const subtaskId = "subtask" + (subtasks.length + 1);
    subtasks.push({
      id: subtaskId,
      name: subtaskText,
      done: false,
    });

    renderSubtasks();
    clearSubtaskInput();
    transformSubtaskInput(false);
  }
}

/**
 * Clears the subtask input field
 */
function clearSubtaskInput() {
  const subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput) {
    subtaskInput.value = '';
    transformSubtaskInput(false);
  }
}

/**
 * Renders all subtasks in the subtasks list
 */
function renderSubtasks() {
  const subtasksList = document.querySelector(".subtasks-list");
  if (!subtasksList) return;

  subtasksList.innerHTML = "";

  subtasks.forEach((subtask, index) => {
    const subtaskElement = document.createElement("div");
    subtaskElement.className = "subtask-item";
    subtaskElement.innerHTML = createSubtaskHTML(subtask, index);
    subtasksList.appendChild(subtaskElement);
  });
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
        <div class="subtask-item-actions">
            <img src="./assets/icons/edit.svg" alt="Edit" onclick="editSubtask(${index})">
            <img src="./assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(${index})">
        </div>
    `;
}

/**
 * Edits an existing subtask
 * @param {number} index - Index of the subtask to edit
 */
function editSubtask(index) {
  const subtask = subtasks[index];
  const subtaskInput = document.getElementById("subtaskInput");
  subtaskInput.value = subtask.name;
  subtaskInput.focus();
  isEditingSubtask = true;

  // Store the index being edited
  subtaskInput.dataset.editIndex = index;

  // Transform the input to show action buttons
  transformSubtaskInput(true);
}

/**
 * Deletes a subtask from the list
 * @param {number} index - Index of the subtask to delete
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

/**
 * Gets subtasks in the format required by the database
 * @returns {Object} Subtasks object for database
 */
function getSubtasks() {
  const subtasksObj = {};
  subtasks.forEach((subtask) => {
    subtasksObj[subtask.id] = {
      name: subtask.name,
      done: subtask.done,
    };
  });
  return subtasksObj;
}

/**
 * Clears all subtasks
 */
function clearSubtasks() {
  subtasks = [];
  renderSubtasks();
}
