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

function addUser() {
  let name = document.getElementById("inputName");
  let email = document.getElementById("inputMail");
  let password = document.getElementById("inputLock");
  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  //window.location.href = "index.html";
  console.log(users);
}
