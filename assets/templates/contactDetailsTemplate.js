/**
 * Displays contact details in the contact info container
 * @param {string} key - Contact's unique identifier
 * @param {string} name - Contact's name
 * @param {string} email - Contact's email
 * @param {string} phone - Contact's phone number
 * @param {string} avatarColor - Color for contact's avatar
 */
function displayContactDetails(key, name, email, phone, avatarColor) {
    const contactInfoContainer = document.querySelector(".contact-info");
    contactInfoContainer.innerHTML = getContactDetailsHTML(key, name, email, phone, avatarColor);
    showContactInfoOnMobile();
    scrollToTop();
}

/**
 * Shows contact info panel on mobile devices
 */
function showContactInfoOnMobile() {
    let info = document.getElementById("contact-info");
    if (window.innerWidth <= 1200) info.classList.remove("dNone");
}

/**
 * Generates HTML for contact details
 * @param {string} key - Contact's unique identifier
 * @param {string} name - Contact's name
 * @param {string} email - Contact's email
 * @param {string} phone - Contact's phone number
 * @param {string} avatarColor - Color for contact's avatar
 * @returns {string} HTML string for contact details
 */
function getContactDetailsHTML(key, name, email, phone, avatarColor) {
    const initials = getInitials(name);
    return `
      <div class="contact-info-header">
          <h1>Contacts</h1>
          <div class="header-divider"></div>
          <span class="header-subtitle">Better with a team</span>
      </div>
      <img onclick="onHideContactInfoClicked()" class="respArrow" src="./assets/icons/arrow-left-line.svg" alt="">
      ${getContactProfileHTML(key, name, email, phone, avatarColor, initials)}
      ${getContactInfoHTML(email, phone)}
      <img onclick="toggleDropdown(event)" class="exportMenu" src="./assets/icons/Menu Contact options.svg" alt="">
      <div id="dropdownMenu" class="dropdown-overlay-content ">
        <a onclick="toggleEditOverlay('${key}','${name}', '${email}', '${phone}')">Edit</a>
        <a onclick="deleteContactToFirebase('${key}')">Delete</a>
      </div>
    `;
}

/**
 * Gets initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("");
}

/**
 * Generates HTML for contact profile section
 * @param {string} key - Contact's unique identifier
 * @param {string} name - Contact's name
 * @param {string} email - Contact's email
 * @param {string} phone - Contact's phone number
 * @param {string} avatarColor - Color for contact's avatar
 * @param {string} initials - Contact's initials
 * @returns {string} HTML string for profile section
 */
function getContactProfileHTML(key, name, email, phone, avatarColor, initials) {
    return `
    <div class="contact-details">
      <div class="profile-section">
        <div class="contact-avatar large" style="background-color: ${avatarColor}">
          <span>${initials}</span>
        </div>
        <div class="profile-info">
          <h2>${name}</h2>
          <div class="profile-actions">
            <button class="action-link" onclick="toggleEditOverlay('${key}','${name}', '${email}', '${phone}')">
              <img src="./assets/icons/edit.svg" alt="" class="action-icon" />Edit
            </button>
            <button onclick="deleteContactToFirebase('${key}')" class="action-link">
              <img src="./assets/icons/delete.svg" alt="" class="action-icon" />Delete
            </button>
          </div>
        </div>
      </div>`;
}

/**
 * Generates HTML for contact information section
 * @param {string} email - Contact's email
 * @param {string} phone - Contact's phone number
 * @returns {string} HTML string for contact information
 */
function getContactInfoHTML(email, phone) {
    return `
      <div class="contact-information">
        <h3>Contact Information</h3>
        <div class="info-group">
          <label class="info-label">Email</label>
          <a href="mailto:${email}" class="info-value">${email}</a>
        </div>
        <div class="info-group">
          <label class="info-label">Phone</label>
          <a href="tel:${phone}" class="info-value phone">${phone}</a>
        </div>
      </div>
    </div>`;
}
