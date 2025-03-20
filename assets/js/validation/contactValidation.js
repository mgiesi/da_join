/**
 * Validates all required input fields for contact form
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateInputs() {
  const fields = ["inputCall", "inputName", "inputMail"];
  let allValid = true;

  fields.forEach((id) => {
    const input = document.getElementById(id);
    const errorDiv = getOrCreateErrorDiv(id, input);
    if (!validateField(input, errorDiv)) allValid = false;
  });

  return allValid;
}

/**
 * Gets an existing error div or creates a new one if it doesn't exist
 * @param {string} id - The ID of the input field
 * @param {HTMLElement} input - The input DOM element
 * @returns {HTMLElement} The error div element
 */
function getOrCreateErrorDiv(id, input) {
  let errorDiv = document.getElementById(id + "-error");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = id + "-error";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "12px";
    input.parentNode.appendChild(errorDiv);
  }
  return errorDiv;
}

/**
 * Validates a specific input field based on its ID
 * @param {HTMLElement} input - The input DOM element to validate
 * @param {HTMLElement} errorDiv - The error div to display validation messages
 * @returns {boolean} True if field is valid, false otherwise
 */
function validateField(input, errorDiv) {
  const value = input.value.trim();

  if (input.id === "inputName") {
    const nameRegex = /^[A-Za-zÄÖÜäöüß]+(?:\s[A-Za-zÄÖÜäöüß]+)*$/;
    if (!nameRegex.test(value)) {
      errorDiv.textContent =
        "Invalid name: only letters and spaces between words allowed.";
      return false;
    }
  } else if (value === "") {
    errorDiv.textContent = "This field is required.";
    return false;
  }

  errorDiv.textContent = "";
  return true;
}

/**
 * Validates all required input fields for contact edit form
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateEditInputs() {
  const fields = ["inputEditCall", "inputEditName", "inputEditMail"];
  let allValid = true;

  fields.forEach((id) => {
    const input = document.getElementById(id);
    const errorDiv = getOrCreateErrorDiv(id, input);
    if (!validateEditField(input, errorDiv)) allValid = false;
  });

  return allValid;
}

/**
 * Gets an existing error div or creates a new one for edit form
 * @param {string} id - The ID of the input field
 * @param {HTMLElement} input - The input DOM element
 * @returns {HTMLElement} The error div element
 */
function getOrCreateEditErrorDiv(id, input) {
  let errorDiv = document.getElementById(id + "-error");
  if (!errorDiv) {
    errorDiv = createEditErrorDiv(id);
    input.parentNode.appendChild(errorDiv);
  }
  return errorDiv;
}

/**
 * Creates a new error div for edit form
 * @param {string} id - The ID of the input field
 * @returns {HTMLElement} The newly created error div
 */
function createEditErrorDiv(id) {
  const errorDiv = document.createElement("div");
  errorDiv.id = id + "-error";
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "14px";
  return errorDiv;
}

/**
 * Validates a specific input field in edit form based on its ID
 * @param {HTMLElement} input - The input DOM element to validate
 * @param {HTMLElement} errorDiv - The error div to display validation messages
 * @returns {boolean} True if field is valid, false otherwise
 */
function validateEditField(input, errorDiv) {
  const value = input.value.trim();

  if (input.id === "inputEditName") {
    const nameRegex = /^[A-Za-zÄÖÜäöüß]+(?:\s[A-Za-zÄÖÜäöüß]+)*$/;
    if (!nameRegex.test(value)) {
      errorDiv.textContent =
        "Invalid name: only letters and spaces between words allowed.";
      return false;
    }
  } else if (value === "") {
    errorDiv.textContent = "This field is required.";
    return false;
  }

  errorDiv.textContent = "";
  return true;
}

/**
 * Validates phone number format in edit form
 * @returns {boolean} True if phone number is valid, false otherwise
 */
function phoneEditValidation() {
  let phone = document.getElementById("inputEditCall");
  let inputValue = phone.value.trim();
  let warning = document.getElementById("namePhoneWarning");

  let phonePattern = /^[0-9]{3,}$/;

  if (!phonePattern.test(inputValue)) {
    warning.classList.remove("dNone");
    warning.textContent = "Please use a correct PhoneNumber.";
    return false;
  }

  warning.classList.add("dNone");
  return true;
}

/**
 * Hides contact information panel on large screens (width > 1200px)
 * @returns {void}
 */
function hideContactInfoOnLargeScreens() {
  let info = document.getElementById("contact-info");

  if (window.innerWidth > 1200) {
    info.style.visibility = "hidden";
    info.style.opacity = "0";
  }
}