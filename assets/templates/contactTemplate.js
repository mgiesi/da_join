/**
 * Main contact template file that imports all contact-related modules
 */

// Import functions from other files
document.addEventListener("DOMContentLoaded", function () {
  // Load all required scripts
  loadScript("assets/templates/contactDetailsTemplate.js");
  loadScript("assets/templates/contactOverlayTemplate.js");
  loadScript("assets/templates/contactEditTemplate.js");
  loadScript("assets/templates/contactUIHandlers.js");
  loadScript("assets/templates/contactValidation.js");

  // Initialize contact handlers
  setTimeout(() => {
    setupContactClickHandler();
    setupContactInfoResponsive();
  }, 100);
});

/**
 * Dynamically loads a script
 * @param {string} src - Path to the script file
 */
function loadScript(src) {
  const script = document.createElement("script");
  script.src = src;
  script.async = false;
  document.head.appendChild(script);
}