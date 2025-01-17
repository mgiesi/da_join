function navigateToSignUp() {
  window.location.href = "signUp.html";
}

function navigateToSummary() {
  window.location.href = "summary.html";
}

function showMessage() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}
