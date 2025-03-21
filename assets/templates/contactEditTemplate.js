/**
 * Returns HTML for the edit contact overlay
 * @param {string} key - Contact's unique identifier
 * @param {string} name - Contact's name
 * @param {string} email - Contact's email
 * @param {string} phone - Contact's phone number
 * @returns {string} HTML string for edit contact overlay
 */
function getEditOverlay(key, name, email, phone) {
    return `
    <div class="overlay">
      <div class="overlay-left">
        <div onclick="toggleEditOverlay()" class="respClose-Btn">×</div>
        ${getEditOverlayLeftContent()}
      </div>
      <div class="overlay-right">
        <div onclick="toggleEditOverlay()" class="close-btn">×</div>
        ${getEditOverlayFormContent(key, name, email, phone)}
      </div>
    </div>`;
}

/**
 * Returns HTML for the left side of the edit overlay
 * @returns {string} HTML string for edit overlay left content
 */
function getEditOverlayLeftContent() {
    return `
    <div class="logo1">
      <img class="logoInnerOverlay" src="./assets/icons/Logo-side-bar.png" alt="" />
    </div>
    <h1 class="f1">Edit contact</h1>
    <hr />`;
}

/**
 * Returns HTML for the form in the edit overlay
 * @param {string} key - Contact's unique identifier
 * @param {string} name - Contact's name
 * @param {string} email - Contact's email
 * @param {string} phone - Contact's phone number
 * @returns {string} HTML string for edit overlay form
 */
function getEditOverlayFormContent(key, name, email, phone) {
    return `
    <div class="form-container">
      <img class="avatar" src="./assets/icons/Group 13.svg" alt="" />
      <form id="contact-form">
        ${getEditFormInputFields(name, email, phone)}
        ${getEditFormButtons(key)}
      </form>
    </div>`;
}

/**
 * Returns HTML for edit form input fields
 * @param {string} name - Contact's name
 * @param {string} email - Contact's email
 * @param {string} phone - Contact's phone number
 * @returns {string} HTML string for edit form inputs
 */
function getEditFormInputFields(name, email, phone) {
    return `
    <div class="form-group">
      <input value="${name}" id="inputEditName" type="text" placeholder="Name" required />
      <i class="icon-user"></i>
      <div><p id="nameWarning" class="fS dNone addFont">Name: at least 3 letters, no numbers.</p></div>
    </div>
    <div class="form-group">
      <input value="${email}" id="inputEditMail" type="text" placeholder="Email" required />
      <i class="icon-email"></i>
      <div><p id="nameEWarning" class="fS dNone addFont">Please use a correct email address.</p></div>
    </div>
    <div class="form-group">
      <input value="${phone}" id="inputEditCall" type="text" placeholder="Phone" required />
      <i class="icon-phone"></i>
      <div><p id="nameEPhoneWarning" class="fS dNone addFont">Please use a correct PhoneNumber.</p></div>
    </div>`;
}

/**
 * Returns HTML for edit form buttons
 * @param {string} key - Contact's unique identifier
 * @returns {string} HTML string for edit form buttons
 */
function getEditFormButtons(key) {
    return `
    <div class="button-group">
      <button onclick="deleteContactToFirebaseWithDialogRemove('${key}')" type="button" class="cancel-btn">
        Delete<img src="./assets/icons/cancel.svg" />
      </button>
      <button id="addContactButton" onclick="UpdateNewContactToFirebase('${key}')" name="submit" type="button" class="create-btn">
        Save <img src="./assets/icons/check.svg" alt="" />
      </button>
    </div>`;
}
