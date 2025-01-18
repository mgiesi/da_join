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
  document.getElementById("overlay").classList.remove("dNone");
  overlay.classList.add("animate");
  setTimeout(function () {
    window.location.href = "index.html";
  }, 2000);
}
