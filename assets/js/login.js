let users = [
  { name: "Markus Giesinger", email: "test@web.de", password: "test" },
];

function navigateToSignUp() {
  window.location.href = "signUp.html";
}

function navigateToIndex() {
  window.location.href = "index.html";
}

function navigateToSummary() {
  window.location.href = "summary.html";
}

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

async function login() {
  const email = document.getElementById("inputMail").value;
  const password = document.getElementById("inputLock").value;

  const dbUrl =
    "https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/user.json";

  try {
    const response = await fetch(dbUrl);
    if (!response.ok) {
      throw new Error("Fehler beim Abrufen der Benutzerdaten");
    }

    const users = await response.json();

    if (!users) {
      console.log("Keine Benutzer gefunden.");
      return;
    }
    const user = Object.values(users).find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      navigateToSummary();
    } else {
      let loginDialog = document.getElementById("dialogLogin");
      loginDialog.classList.remove("dNone");
    }
  } catch (error) {
    console.error("Fehler:", error);
  }
}

async function addUser() {
  const { name, email, password, confirmPassword } = getUserInput();
  if (!validateInput(name, email, password, confirmPassword)) return;
  if (!validatePassword(password, confirmPassword)) return;

  const newUser = { name, email, password };
  await saveUser(newUser);
}

function getUserInput() {
  return {
    name: document.getElementById("inputName").value,
    email: document.getElementById("inputMail").value,
    password: document.getElementById("inputLock").value,
    confirmPassword: document.getElementById("inputConfirm").value,
  };
}

function validateInput(name, email, password, confirmPassword) {
  if (!name || !email || !password || !confirmPassword) {
    document.getElementById("FieldsSignUp").classList.remove("dNone");
    return false;
  }
  return true;
}

function validatePassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    document.getElementById("passwordSignUp").classList.remove("dNone");
    return false;
  }
  return true;
}

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

async function getUserCount() {
  const response = await fetch(
    "https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/user.json"
  );
  if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
  const users = await response.json();
  return users ? Object.keys(users).length : 0;
}

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
