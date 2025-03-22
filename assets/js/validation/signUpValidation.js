/**
 * Validates all required input fields in the sign-up form.
 * Currently validates only the name input field.
 *
 * @returns {boolean} Returns true if all fields are valid, false otherwise.
 */
function validateInputs() {
  const fields = ["inputName"];
  let allValid = true;

  fields.forEach((id) => {
    const input = document.getElementById(id);
    const errorDiv = document.getElementById("errorName");

    if (!validateField(input, errorDiv)) {
      errorDiv.classList.remove("dNone");
      allValid = false;
    } else {
      errorDiv.classList.add("dNone");
    }
  });

  return allValid;
}

/**
 * Validates a specific input field based on its ID.
 * Currently handles name validation with a regex pattern.
 *
 * @param {HTMLElement} input - The input element to validate
 * @param {HTMLElement} errorDiv - The div element to display error messages
 * @returns {boolean} Returns true if the field is valid, false otherwise
 */
function validateField(input, errorDiv) {
  const value = input.value.trim();

  if (input.id === "inputName") {
    const nameRegex = /^[A-Za-zÄÖÜäöüß]+(?:\s[A-Za-zÄÖÜäöüß]+)*$/;
    if (!nameRegex.test(value)) {
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
 * Validates the email input field using a regex pattern.
 * Shows or hides an error message based on validation result.
 *
 * @returns {boolean} Returns true if the email is valid, false otherwise
 */
function emailValidation() {
  let email = document.getElementById("inputMail");
  let inputValue = email.value.trim();
  let warning = document.getElementById("errorMail");

  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(inputValue)) {
    warning.classList.remove("dNone");
    return false;
  }

  warning.classList.add("dNone");
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("inputMail")
    .addEventListener("blur", emailValidation);
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("inputName").addEventListener("blur", validateInputs);
});
