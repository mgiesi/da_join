/**
 * Validates the name input field
 * @returns {boolean} True if validation passes, false otherwise
 */
function controlValidation() {
    let name = document.getElementById("inputName");
    let inputValue = name.value.trim();
    let warning = document.getElementById("nameWarning");

    if (/[0-9]/.test(inputValue) || /^[A-Za-z]{1,2}$/.test(inputValue)) {
        warning.classList.remove("dNone");
        return false;
    }
    warning.classList.add("dNone");
    return true;
}

/**
 * Validates the email input field
 * @returns {boolean} True if validation passes, false otherwise
 */
function emailValidation() {
    let email = document.getElementById("inputMail");
    let inputValue = email.value.trim();
    let warning = document.getElementById("nameEWarning");
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(inputValue)) {
        warning.classList.remove("dNone");
        warning.textContent = "Please use a correct email address.";
        return false;
    }
    warning.classList.add("dNone");
    return true;
}

/**
 * Validates the phone input field
 * @returns {boolean} True if validation passes, false otherwise
 */
function phoneValidation() {
    let phone = document.getElementById("inputCall");
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
 * Validates the name input field in edit mode
 * @returns {boolean} True if validation passes, false otherwise
 */
function editControlValidation() {
    let name = document.getElementById("inputEditName");
    let inputValue = name.value.trim();
    let warning = document.getElementById("nameWarning");

    if (/[0-9]/.test(inputValue) || /^[A-Za-z]{1,2}$/.test(inputValue)) {
        warning.classList.remove("dNone");
        return false;
    }
    warning.classList.add("dNone");
    return true;
}

/**
 * Validates the email input field in edit mode
 * @returns {boolean} True if validation passes, false otherwise
 */
function editEmailValidation() {
    let email = document.getElementById("inputEditMail");
    let inputValue = email.value.trim();
    let warning = document.getElementById("nameEWarning");
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(inputValue)) {
        warning.classList.remove("dNone");
        warning.textContent = "Please use a correct email address.";
        return false;
    }
    warning.classList.add("dNone");
    return true;
}

/**
 * Validates the phone input field in edit mode
 * @returns {boolean} True if validation passes, false otherwise
 */
function editPhoneValidation() {
    let phone = document.getElementById("inputEditCall");
    let inputValue = phone.value.trim();
    let warning = document.getElementById("nameEPhoneWarning");
    let phonePattern = /^[0-9]{3,}$/;

    if (!phonePattern.test(inputValue)) {
        warning.classList.remove("dNone");
        warning.textContent = "Please use a correct PhoneNumber.";
        return false;
    }
    warning.classList.add("dNone");
    return true;
}
