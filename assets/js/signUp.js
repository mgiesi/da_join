/**
 * Navigates to the sign-up page.
 */
function navigateToSignUp() {
  window.location.href = "signUp.html";
}

/**
 * Navigates to the index page.
 */
function navigateToIndex() {
  window.location.href = "index.html";
}

/**
 * Navigates to the summary page.
 */
function navigateToSummary() {
  window.location.href = "summary.html";
}

/**
 * Shows a message upon user interaction with a checkbox.
 * If the checkbox is checked, the user is redirected to the index page.
 */
function showMessage() {
  let checkbox = document.getElementById("checkbox");
  let dialogSignUp = document.getElementById("dialogSignUp");

  if (checkbox && checkbox.checked) {
    document.getElementById("overlay").classList.remove("dNone");
    overlay.classList.add("animate");
    setTimeout(function () {
      window.location.href = "index.html";
    }, 2000);
  } else {
    dialogSignUp.classList.remove("dNone");
  }
}

/**
 * Logs in as a guest by setting the user as "Guest" and navigating to the summary page.
 */
function loginAsGuest() {
  localStorage.setItem("activeUser", "Guest");
  navigateToSummary();
}

/**
 * Handles the login process by validating user credentials and navigating to the summary page if successful.
 */
async function login() {
  const email = document.getElementById("inputMail").value;
  const password = document.getElementById("inputLock").value;

  const dbUrl = DB_BASE_URL + "user.json";

  try {
    const users = await fetchUserData(dbUrl);
    if (!users) return console.log("Keine Benutzer gefunden.");

    const user = findUser(users, email, password);
    user ? handleLoginSuccess(user) : handleLoginFailure();
  } catch (error) {
    handleLoginError(error);
  }
}

/**
 * Fetches user data from the specified URL.
 */
async function fetchUserData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Benutzerdaten");
  }
  return response.json();
}

/**
 * Finds a user by email and password from the list of users.
 */
function findUser(users, email, password) {
  return Object.values(users).find(
    (u) => u.email === email && u.password === password
  );
}

/**
 * Handles successful login by setting the active user in localStorage and navigating to the summary page.
 */
function handleLoginSuccess(user) {
  localStorage.setItem("activeUser", user.email);
  navigateToSummary();
}

/**
 * Handles failed login by showing the login error dialog and highlighting invalid inputs.
 */
function handleLoginFailure() {
  localStorage.removeItem("activeUser");
  document.getElementById("dialogLogin").classList.remove("dNone");
  redInput();
}

/**
 * Handles login errors and logs the error message to the console.
 */
function handleLoginError(error) {
  localStorage.removeItem("activeUser");
  console.error("Fehler:", error);
}

/**
 * Adds a new user by validating the input and saving the user to the database.
 */
async function addUser() {
  const { name, email, password, confirmPassword } = getUserInput();

  if (!validateInput(name, email, password, confirmPassword)) return;
  if (!emailValidation(email)) return;
  if (!validateInputs(name, email)) return;
  if (!validatePassword(password, confirmPassword)) return;

  const newUser = { name, email, password };
  await saveUser(newUser);
}

/**
 * Retrieves the user input from the sign-up form.
 */
function getUserInput() {
  return {
    name: document.getElementById("inputName").value,
    email: document.getElementById("inputMail").value,
    password: document.getElementById("inputLock").value,
    confirmPassword: document.getElementById("inputConfirm").value,
  };
}

/**
 * Validates the user input fields for name, email, password, and confirmPassword.
 */
function validateInput(name, email, password, confirmPassword) {
  const errorDiv = document.getElementById("FieldsSignUp");

  if (!name || !email || !password || !confirmPassword) {
    errorDiv.classList.remove("dNone");
    return false;
  }

  errorDiv.classList.add("dNone");
  return true;
}

/**
 * Validates if the password and confirmPassword match.
 */
function validatePassword() {
  const password = document.getElementById("inputLock").value;
  const confirmPassword = document.getElementById("inputConfirm").value;
  const errorMessage = document.getElementById("passwordSignUp");

  if (password !== confirmPassword) {
    errorMessage.classList.remove("dNone");
    return false;
  } else {
    errorMessage.classList.add("dNone");
    return true;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("inputConfirm")
    .addEventListener("blur", validatePassword);
});

/**
 * Saves a new user to the database.
 */
async function saveUser(newUser) {
  try {
    const userCount = await getUserCount();
    const newUserKey = `user${userCount + 1}`;
    await saveToDatabase(newUser, newUserKey);
    showMessage();
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

/**
 * Gets the total count of users in the database.
 */
async function getUserCount() {
  const response = await fetch(DB_BASE_URL + "user.json");
  if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
  const users = await response.json();
  return users ? Object.keys(users).length : 0;
}

/**
 * Saves a user to the Firebase database.
 */
async function saveToDatabase(user, key) {
  const response = await fetch(
    `${DB_BASE_URL}user/${key}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }
  );
  if (!response.ok) throw new Error(`Save error: ${response.status}`);
}

/**
 * Hides the error message if the checkbox is checked.
 *
 * This function checks whether the checkbox with the ID "checkbox" is checked.
 * If it is checked, the element with the ID "dialogSignUp" will be hidden by
 * adding the "dNone" class.
 */
function hideMessageIfChecked() {
  let checkbox = document.getElementById("checkbox");
  let dialogSignUp = document.getElementById("dialogSignUp");

  if (checkbox && checkbox.checked) {
    dialogSignUp.classList.add("dNone");
  }
}
