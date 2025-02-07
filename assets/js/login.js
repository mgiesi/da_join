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

function showMessage(event) {
  event.preventDefault();
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

async function addUser() {
  let name = document.getElementById("inputName").value;
  let email = document.getElementById("inputMail").value;
  let password = document.getElementById("inputLock").value;

  if (!name || !email || !password) {
    let addDialog = document.getElementById("FieldsSignUp");
    addDialog.classList.remove("dNone");
    return;
  }

  const newUser = {
    name,
    email,
    password,
  };

  try {
    const response = await fetch(
      "https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app//user.json"
    );

    const user = await response.json();
    const userKeys = user ? Object.keys(user) : [];
    const nextUser = userKeys.length + 1;
    const newUserKey = `user${nextUser}`;

    const saveResponse = await fetch(
      `https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app//user/${newUserKey}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }
    );
    //showMessage();

    if (!saveResponse.ok) {
      throw new Error(
        `Fehler beim Speichern des Kontakts: ${saveResponse.status}`
      );
    }
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts:", error);
  }
}
