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

//validateInputs();
//if (!validateInputs(name, email, phone)) return;
