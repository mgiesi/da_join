function initLogin() {
  logoutUser();
}

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

  const dbUrl =
    "https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/user.json";

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
  emailValidation();
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
  if (!name || !email || !password || !confirmPassword) {
    document.getElementById("FieldsSignUp").classList.remove("dNone");
    return false;
  }
  return true;
}

/**
 * Validates if the password and confirmPassword match.
 */
function validatePassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    document.getElementById("passwordSignUp").classList.remove("dNone");
    return false;
  }
  return true;
}

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
  const response = await fetch(
    "https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/user.json"
  );
  if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
  const users = await response.json();
  return users ? Object.keys(users).length : 0;
}

/**
 * Saves a user to the Firebase database.
 */
async function saveToDatabase(user, key) {
  const response = await fetch(
    `https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/user/${key}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }
  );
  if (!response.ok) throw new Error(`Save error: ${response.status}`);
}

/**
 * Handles the animation of the start overlay and ensures it's only shown once.
 */
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("animationPlayed")) {
    setTimeout(() => {
      document.getElementById("startOverlay").style.display = "none";
      localStorage.setItem("animationPlayed", "true");
    }, 1000);
  } else {
    document.getElementById("startOverlay").style.display = "none";
  }
});

/**
 * Highlights input fields with a red border for invalid input.
 */
function redInput() {
  const inputs = document.querySelectorAll(
    "input[type='email'], input[type='text'], input[type='password']"
  );

  inputs.forEach((input) => {
    input.style.border = "2px solid #e22929";
  });
}

/**
 * Wartet, bis das DOM geladen ist, und startet das Overlay-Handling.
 */
document.addEventListener("DOMContentLoaded", initOverlay);

/**
 * Initialisiert das Overlay, falls die Bildschirmbreite < 1200px ist.
 */
function initOverlay() {
  const overlay = document.getElementById("RespOverlay");
  const logo = document.getElementById("RespLogo");

  if (window.innerWidth < 1200) {
    animateLogo(logo);
    fadeOutOverlay(overlay);
  } else {
    hideElement(overlay);
  }
}

/**
 * Startet die Logo-Animation.
 * @param {HTMLElement} logo - Das Logo-Element.
 */
function animateLogo(logo) {
  setTimeout(() => logo.classList.add("RespLogo-animate"), 500);
}

/**
 * Blendet das Overlay langsam aus.
 * @param {HTMLElement} overlay - Das Overlay-Element.
 */
function fadeOutOverlay(overlay) {
  setTimeout(() => {
    overlay.style.transition = "opacity 1.5s ease-out";
    overlay.style.opacity = "0";
  }, 500);

  setTimeout(() => hideElement(overlay), 2000);
}

/**
 * Versteckt ein Element.
 * @param {HTMLElement} element - Das zu versteckende Element.
 */
function hideElement(element) {
  element.style.display = "none";
}
