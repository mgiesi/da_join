/**
 * Returns HTML for the add contact overlay
 * @returns {string} HTML string for add contact overlay
 */
function getOverlay() {
  return `
    <div class="overlay">
      <div class="overlay-left">
        <div onclick="toggleOverlay()" class="respClose-Btn">×</div>
        ${getOverlayLeftContent()}
      </div>
      <div class="overlay-right">
        <div onclick="toggleOverlay()" class="close-btn">×</div>
        ${getOverlayFormContent()}
      </div>
    </div>`;
}

/**
 * Returns HTML for the left side of the overlay
 * @returns {string} HTML string for overlay left content
 */
function getOverlayLeftContent() {
  return `
    <div class="logo1">
      <img class="logoInnerOverlay" src="./assets/icons/Logo-side-bar.png" alt="" />
    </div>
    <h1 class="f1">Add contact</h1>
    <p class="f4 font-weight: none;">Tasks are better with a team!</p>
    <hr />`;
}

/**
 * Returns HTML for the form in the overlay
 * @returns {string} HTML string for overlay form
 */
function getOverlayFormContent() {
  return `
    <div class="form-container">
      <img class="avatar" src="./assets/icons/Group 13.svg" alt="" />
      <form id="contact-form">
        ${getFormInputFields()}
        ${getFormButtons()}
      </form>
    </div>`;
}

/**
 * Returns HTML for form input fields
 * @returns {string} HTML string for form inputs
 */
function getFormInputFields() {
  return `
    <div class="form-group">
      <input id="inputName" type="text" placeholder="Name" required minlength="3" />
      <i class="icon-user"></i>
      <div><p id="nameWarning" class="dNone addFont">Name: at least 3 letters, no numbers.</p></div>
    </div>
    <div class="form-group">
      <input id="inputMail" type="email" placeholder="YourEmail@example.com" required />
      <i class="icon-email"></i>
      <div><p id="nameEWarning" class="fS dNone addFont">Please use a correct email address.</p></div>
    </div>
    <div class="form-group">
      <input id="inputCall" type="phone" placeholder="Phone" required />
      <i class="icon-phone"></i>
      <div><p id="namePhoneWarning" class="fS dNone addFont">Please use a correct PhoneNumber.</p></div>
    </div>`;
}

/**
 * Returns HTML for form buttons
 * @returns {string} HTML string for form buttons
 */
function getFormButtons() {
  return `
    <div class="button-group">
      <button onclick="toggleOverlay()" type="button" class="cancel-btn">
        Cancel<img src="./assets/icons/cancel.svg" />
      </button>
      <button id="addContactButton" onclick="addNewContactToFirebase()" type="button" class="create-btn">
        Create contact <img src="./assets/icons/check.svg" alt="" />
      </button>
    </div>`;
}
