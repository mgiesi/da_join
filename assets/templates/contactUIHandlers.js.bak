/**
 * Marks a contact as active when clicked
 */
function setupContactClickHandler() {
  document.body.onclick = function (event) {
    let contact = event.target.closest(".contact");
    if (!contact) return;
    document
      .querySelectorAll(".contact.active")
      .forEach((c) => c.classList.remove("active"));
    contact.classList.add("active");
  };
}

/**
 * Sets up responsive behavior for contact info panel
 */
function setupContactInfoResponsive() {
  const contactInfo = document.querySelector(".contact-info");
  checkScreenSize(contactInfo);
  window.onresize = () => checkScreenSize(contactInfo);
}

/**
 * Adjusts contact info visibility based on screen size
 * @param {HTMLElement} contactInfo - The contact info container
 */
function checkScreenSize(contactInfo) {
  if (window.innerWidth <= 1530) {
    setupMobileContactView(contactInfo);
  } else {
    setupDesktopContactView(contactInfo);
  }
}

/**
 * Sets up mobile view for contacts
 * @param {HTMLElement} contactInfo - The contact info container
 */
function setupMobileContactView(contactInfo) {
  document.body.onclick = (event) => handleContactClick(event, contactInfo);
}

/**
 * Sets up desktop view for contacts
 * @param {HTMLElement} contactInfo - The contact info container
 */
function setupDesktopContactView(contactInfo) {
  document.body.onclick = null;
  contactInfo.style.visibility = "visible";
  contactInfo.style.opacity = "1";
}

/**
 * Handles click on contact elements
 * @param {Event} event - Click event
 * @param {HTMLElement} contactInfo - The contact info container
 */
function handleContactClick(event, contactInfo) {
  let contact = event.target.closest(".contact");
  if (contact) {
    showContactInfo(contact, contactInfo);
  } else {
    hideContactInfo(contactInfo);
  }
}

/**
 * Hides the contact info panel
 * @param {HTMLElement} contactInfo - The contact info container
 */
function hideContactInfo(contactInfo) {
  contactInfo.style.visibility = "hidden";
  contactInfo.style.opacity = "0";
}

/**
 * Scrolls the page to the top with a smooth animation
 */
function scrollToTop() {
  if (window.innerWidth < 1200) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Initializes event listeners when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  setupContactClickHandler();
  injectHighlightStyle();
});

/**
 * Sets up the click event handler for contact elements.
 */
function setupContactClickHandler() {
  document.body.addEventListener("click", handleContactClick);
}

/**
 * Handles the click event on a contact element.
 * @param {Event} event - The click event.
 */
/**
 * Handles the click event on a contact element.
 * @param {Event} event - The click event.
 */

/**
 * Removes active and highlighted classes from all contact elements.
 */
function resetActiveContacts() {
  document
    .querySelectorAll(".contact.active, .contact-email.highlight")
    .forEach((c) => c.classList.remove("active", "highlight"));
}

/**
 * Marks a contact as active and highlights its email.
 * @param {HTMLElement} contact - The contact element.
 */
function markContactActive(contact) {
  contact.classList.add("active");
  let email = contact.querySelector(".contact-email");
  if (email) email.classList.add("highlight");
}

/**
 * Injects CSS styles for highlighting contact emails.
 */
function injectHighlightStyle() {
  let existingStyle = document.querySelector("#contact-email-style");
  if (existingStyle) return;
  const style = document.createElement("style");
  style.id = "contact-email-style";
  style.textContent = ".contact-email.highlight { color: #007CEE !important; }";
  document.head.appendChild(style);
}
