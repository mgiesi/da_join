/**
 * Initializes the add task page by loading HTML components, fetching contacts, and setting up functionality
 * @returns {Promise<void>}
 */
async function initAddTask() {
  await init();
  fetchContacts();
  initializeAll();
}

/**
 * Sets up all core functionality components for the add task page
 * @returns {void}
 */
function initializeAll() {
  initFormValidation();
  setupPrioritySystem();
  setupSelectArrows();
  initCustomDropdowns();
  initSubtaskSystem(); // Initialize subtask functionality

  // Set medium priority as default
  const mediumPriorityBtn = document.getElementById("add-task-btn-medium");
  if (mediumPriorityBtn) {
    activatePriorityButton(mediumPriorityBtn);
  }
}

/**
 * Sets up focus behavior for all select elements wrapped in .select-wrapper class
 * @returns {void}
 */
function setupSelectArrows() {
  const selectWrappers = document.querySelectorAll(".select-wrapper");
  selectWrappers.forEach((wrapper) => setupSelectFocus(wrapper));
}

/**
 * Handles focus and blur events for individual select elements
 * @param {HTMLElement} wrapper - DOM element containing the select element
 * @returns {void}
 */
function setupSelectFocus(wrapper) {
  const select = wrapper.querySelector("select");
  if (!select) {
    return;
  }
  select.onfocus = () => wrapper.classList.add("focused");
  select.onblur = () => wrapper.classList.remove("focused");
}

/**
 * Initializes the priority selection system by setting up the global click handler
 * @returns {void}
 */
function setupPrioritySystem() {
  window.handlePriorityClick = function (buttonElement) {
    resetPriorityButtons();
    activatePriorityButton(buttonElement);
  };
}

/**
 * Resets all priority buttons to their default state
 * @returns {void}
 */
function resetPriorityButtons() {
  const buttons = document.querySelectorAll(".priority-btn");
  buttons.forEach((btn) => {
    resetSinglePriorityButton(btn);
  });
}

/**
 * Resets a single priority button to its default state
 * @param {HTMLElement} btn - The priority button to reset
 * @returns {void}
 */
function resetSinglePriorityButton(btn) {
  btn.classList.remove("active", "selected");
  btn.style.backgroundColor = "";
  btn.style.color = "";
  btn.style.borderColor = "";

  // Reset any SVG icons inside the buttons if they have custom colors
  const svgIcons = btn.querySelectorAll("svg, img");
  svgIcons.forEach((icon) => {
    icon.style.filter = "";
  });
}

/**
 * Activates the selected priority button
 * @param {HTMLElement} buttonElement - The priority button DOM element to activate
 * @returns {void}
 */
function activatePriorityButton(buttonElement) {
  buttonElement.classList.add("active", "selected");
  const priority = buttonElement.getAttribute("data-priority");
}

/**
 * Shows success notification and redirects to board after task creation
 * @returns {void}
 */
function showTaskAddedNotification() {
  const notification = document.getElementById("taskAddedNotification");
  notification.style.display = "flex";
  setTimeout(() => {
    notification.style.display = "none";
    window.location.href = "board.html";
  }, 3000);
}

/**
 * Resets all fields in the add task form to their default state
 * @returns {void}
 */
function resetForm() {
  resetTextInputs();
  resetContactSelection();
  resetPrioritySelection();
  resetCategoryDropdown();
  clearSubtasks(); // Use our new function
  resetValidationStyling();
}

/**
 * Resets text inputs and textarea fields
 * @returns {void}
 */
function resetTextInputs() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("dueDate").value = "";
}

/**
 * Resets contact selection, avatars and checkboxes
 * @returns {void}
 */
function resetContactSelection() {
  clearContactInputs();
  resetSelectedContactsArray();
  uncheckAllContactBoxes();
}

/**
 * Clears contact search input and avatar display
 * @returns {void}
 */
function clearContactInputs() {
  document.getElementById("contactSearch").value = "";
  document.getElementById("selectedContactsAvatar").innerHTML = "";
}

/**
 * Resets the selected contacts array and updates display
 * @returns {void}
 */
function resetSelectedContactsArray() {
  if (typeof selectedContacts !== "undefined") {
    selectedContacts = [];
    updateContactsDisplay();
  }
}

/**
 * Updates the contacts display using available display functions
 * @returns {void}
 */
function updateContactsDisplay() {
  if (typeof updateSelectedContactsDisplay === "function") {
    updateSelectedContactsDisplay();
  } else if (typeof renderSelectedContactAvatars === "function") {
    renderSelectedContactAvatars();
  }
}

/**
 * Unchecks all contact checkboxes
 * @returns {void}
 */
function uncheckAllContactBoxes() {
  const contactCheckboxes = document.querySelectorAll(
    '.contact-item input[type="checkbox"]'
  );
  contactCheckboxes.forEach((checkbox) => (checkbox.checked = false));
}

/**
 * Resets priority selection state
 * @returns {void}
 */
function resetPrioritySelection() {
  resetPriorityButtons();
  if (typeof currentPriority !== "undefined") {
    currentPriority = null;
  }
}

/**
 * Resets category dropdown to default state
 * @returns {void}
 */
function resetCategoryDropdown() {
  resetCategoryText();
  resetCategoryValue();
}

/**
 * Resets the category dropdown text and adds the dropdown arrow
 * @returns {void}
 */
function resetCategoryText() {
  const categorySelected = document.getElementById("categorySelected");
  if (categorySelected) {
    categorySelected.textContent = "Select task category";
    addCategoryDropdownArrow(categorySelected);
  }
}

/**
 * Adds the dropdown arrow to the category selector
 * @param {HTMLElement} categorySelected - The category selector element
 * @returns {void}
 */
function addCategoryDropdownArrow(categorySelected) {
  const arrowImg = document.createElement("img");
  arrowImg.src = "./assets/icons/arrow_drop_down.svg";
  arrowImg.alt = "Dropdown arrow";
  arrowImg.className = "dropdown-arrow";
  categorySelected.appendChild(arrowImg);
  categorySelected.setAttribute("data-value", "");
}

/**
 * Resets the hidden category input value
 * @returns {void}
 */
function resetCategoryValue() {
  const categoryInput = document.getElementById("category");
  if (categoryInput) categoryInput.value = "";
}

/**
 * Resets subtasks list, input, and clears the subtasks array
 * @returns {void}
 */
function clearSubtasks() {
  // Clear the subtasks array
  subtasks = [];

  // Clear the visual elements
  const subtasksList = document.querySelector(".subtasks-list");
  if (subtasksList) subtasksList.innerHTML = "";

  const subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput) {
    subtaskInput.value = "";
    // Reset the input state using the newly defined function
    if (typeof transformSubtaskInput === 'function') {
      transformSubtaskInput(false);
    }
  }

  // Re-render the empty subtasks list
  renderSubtasks();
}
/**
 * Resets validation styling and error messages
 * @returns {void}
 */
function resetValidationStyling() {
  resetRequiredFieldsValidation();
  resetAllInputBorders();
}

/**
 * Resets validation styling for required fields
 * @returns {void}
 */
function resetRequiredFieldsValidation() {
  const requiredFields = document.querySelectorAll("[required]");
  requiredFields.forEach((field) => {
    field.style.borderColor = "";
    const errorMessage = field.parentNode.querySelector(".error-message");
    if (errorMessage) errorMessage.style.display = "none";
  });
}

/**
 * Resets border color for all input elements
 * @returns {void}
 */
function resetAllInputBorders() {
  const allInputs = document.querySelectorAll("input, textarea, select");
  allInputs.forEach((input) => (input.style.borderColor = ""));
}
