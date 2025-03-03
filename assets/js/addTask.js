/**
 * Initializes the add task page by loading HTML components, fetching contacts, and setting up functionality
 */
async function initAddTask() {
  await init();
  fetchContacts();
  initializeAll();
}
/**
 * Sets up all core functionality components for the add task page
 */
function initializeAll() {
  initFormValidation();
  setupPrioritySystem();
  setupSelectArrows();
  initCustomDropdowns();
  initSubtaskSystem(); // Initialize subtask functionality
}

/**
 * Sets up focus behavior for all select elements wrapped in .select-wrapper class
 */
function setupSelectArrows() {
  const selectWrappers = document.querySelectorAll(".select-wrapper");
  selectWrappers.forEach((wrapper) => setupSelectFocus(wrapper));
}

/**
 * Handles focus and blur events for individual select elements
 * @param {HTMLElement} wrapper - DOM element containing the select element
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
 */
function setupPrioritySystem() {
  window.handlePriorityClick = function (buttonElement) {
    resetPriorityButtons();
    activatePriorityButton(buttonElement);
  };
}

/**
 * Resets all priority buttons to their default state
 */
function resetPriorityButtons() {
  const buttons = document.querySelectorAll(".priority-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active", "selected");
    btn.style.backgroundColor = "";
    btn.style.color = "";
    btn.style.borderColor = "";

    // Reset any SVG icons inside the buttons if they have custom colors
    const svgIcons = btn.querySelectorAll("svg, img");
    svgIcons.forEach((icon) => {
      icon.style.filter = "";
    });
  });
}

/**
 * Activates the selected priority button
 * @param {HTMLElement} buttonElement - The priority button DOM element to activate
 */
function activatePriorityButton(buttonElement) {
  buttonElement.classList.add("active", "selected");
  const priority = buttonElement.getAttribute("data-priority");
}

/**
 * Shows success notification and redirects to board after task creation
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
 */
function resetTextInputs() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("dueDate").value = "";
}

/**
 * Resets contact selection, avatars and checkboxes
 */
function resetContactSelection() {
  document.getElementById("contactSearch").value = "";
  document.getElementById("selectedContactsAvatar").innerHTML = "";

  // Reset selected contacts array
  if (typeof selectedContacts !== "undefined") {
    selectedContacts = [];
    if (typeof updateSelectedContactsDisplay === "function") {
      updateSelectedContactsDisplay();
    } else if (typeof renderSelectedContactAvatars === "function") {
      renderSelectedContactAvatars();
    }
  }

  // Uncheck all contact checkboxes
  const contactCheckboxes = document.querySelectorAll(
    '.contact-item input[type="checkbox"]'
  );
  contactCheckboxes.forEach((checkbox) => (checkbox.checked = false));
}

/**
 * Resets priority selection state
 */
function resetPrioritySelection() {
  resetPriorityButtons();
  if (typeof currentPriority !== "undefined") {
    currentPriority = null;
  }
}

/**
 * Resets category dropdown to default state
 */
function resetCategoryDropdown() {
  const categorySelected = document.getElementById("categorySelected");
  if (categorySelected) {
    categorySelected.textContent = "Select task category";
    const arrowImg = document.createElement("img");
    arrowImg.src = "./assets/icons/arrow_drop_down.svg";
    arrowImg.alt = "Dropdown arrow";
    arrowImg.className = "dropdown-arrow";
    categorySelected.appendChild(arrowImg);
    categorySelected.setAttribute("data-value", "");
  }

  const categoryInput = document.getElementById("category");
  if (categoryInput) categoryInput.value = "";
}

/**
 * Resets subtasks list and input
 */
function clearSubtasks() {
  const subtasksList = document.querySelector(".subtasks-list");
  if (subtasksList) subtasksList.innerHTML = "";

  const subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput) subtaskInput.value = "";
}

/**
 * Resets validation styling and error messages
 */
function resetValidationStyling() {
  const requiredFields = document.querySelectorAll("[required]");
  requiredFields.forEach((field) => {
    field.style.borderColor = "";
    const errorMessage = field.parentNode.querySelector(".error-message");
    if (errorMessage) errorMessage.style.display = "none";
  });

  const allInputs = document.querySelectorAll("input, textarea, select");
  allInputs.forEach((input) => (input.style.borderColor = ""));
}
