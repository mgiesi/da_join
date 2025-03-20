/**
 * UI-related functions for the contacts module
 */

/**
 * Toggles the visibility of the overlay for adding a contact.
 */
function toggleOverlay() {
    let overlay = document.getElementById("overlayAddContact");
    overlay.classList.toggle("dNone");
    overlay.innerHTML = getOverlay();
}

/**
 * Toggles the visibility of the overlay for editing a contact.
 */
function toggleEditOverlay(key, name, email, phone) {
    const overlay = document.getElementById("overlayEditContact");
    overlay.classList.toggle("dNone");
    overlay.innerHTML = getEditOverlay(key, name, email, phone);
}

/**
 * Shows an error message when contact input is invalid.
 */
function showAddDialog() {
    document.getElementById("addFont").classList.remove("dNone");
}

/**
 * Shows an error when the provided contact key is invalid.
 */
function showInvalidContactError() {
    console.error("Fehler: Kein gültiger contactKey gefunden!");
    alert("Fehler: Kein gültiger Kontakt zum Bearbeiten gefunden.");
}

/**
 * Shows a success message after adding a contact.
 */
function showAddMessage() {
    document.getElementById("overlayContactSuccess").classList.remove("dNone");
    overlayContactSuccess.classList.add("animate");
    setTimeout(function () {
        document.getElementById("overlayContactSuccess").classList.add("dNone");
    }, 2000);
}

/**
 * Adjusts the UI for responsive design.
 */
function addDNoneToResp() {
    let info = document.getElementById("contact-info");
    if (window.innerWidth <= 1200) info.classList.add("visHid");
}

/**
 * Toggles the visibility of the dropdown menu for small screens.
 */
function toggleDropdown(event) {
    event.stopPropagation();
    let dropdown = document.getElementById("dropdownMenu");

    if (window.innerWidth < 1200) {
        dropdown.classList.toggle("show");
    }
}

/**
 * Scrolls the page to the top with a smooth animation.
 */
function scrollToTop() {
    if (window.innerWidth < 1200) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

/**
 * Handles click on contact info area.
 */
function onContactInfoClicked(event) {
    event.stopPropagation();
    let dropdown = document.getElementById("dropdownMenu");
    dropdown?.classList.remove("show");
}

/**
 * Hides the contact info panel.
 */
function onHideContactInfoClicked() {
    addDNoneToResp();
    let info = document.getElementById("contact-info");
    info.style.visibility = "hidden";
    info.style.opacity = "0";
}

/**
 * Shows the contact info panel.
 */
function showContactInfo() {
    let contactInfo = document.getElementById("contact-info");
    if (contactInfo) {
        contactInfo.style.opacity = "1";
        contactInfo.style.visibility = "visible";
    }
}

/**
 * Creates the HTML structure for a contact section.
 */
function createSectionHTML(firstLetter) {
    return `
    <div class="section-header">${firstLetter}</div>
    <div class="contact-divider"></div>
  `;
}

/**
 * Creates the HTML structure for a contact.
 */
function createContactHTML(initials, color, contact) {
    return `
    <div class="contact-avatar" style="background-color: ${color}">
      <span>${initials}</span>
    </div>
    <div class="contact-details">
      <span class="contact-name">${contact.name}</span>
      <span class="contact-email">${contact.email}</span>
    </div>
  `;
}
