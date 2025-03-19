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

function getOrCreateEditErrorDiv(id, input) {
  let errorDiv = document.getElementById(id + "-error");
  if (!errorDiv) {
    errorDiv = createEditErrorDiv(id);
    input.parentNode.appendChild(errorDiv);
  }
  return errorDiv;
}

function createEditErrorDiv(id) {
  const errorDiv = document.createElement("div");
  errorDiv.id = id + "-error";
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "14px";
  return errorDiv;
}

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
