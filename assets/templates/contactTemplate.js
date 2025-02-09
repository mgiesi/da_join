function displayContactDetails({ name, email, phone, avatarColor }) {
  const contactInfoContainer = document.querySelector(".contact-info");

  avatarColor = avatarColor;

  const detailsHTML = `
      <div class="contact-info-header">
        <h1>Contacts</h1>
        <div class="header-divider"></div>
        <span class="header-subtitle">Better with a team</span>
      </div>
      <div class="contact-details">
        <div class="profile-section">
          <div
            class="contact-avatar large"
            style="background-color: ${avatarColor}">
            <span>${name
              .split(" ")
              .map((n) => n.charAt(0).toUpperCase())
              .join("")}</span>
          </div>
  
          <div class="profile-info">
            <h2>${name}</h2>
            <div class="profile-actions">
              <button class="action-link" onclick="toggleEditOverlay(['${name}', '${email}', '${phone}'])">
                <img src="./assets/icons/edit.svg" alt="" class="action-icon" />
                Edit
              </button>
              <button onclick="deleteContactToFirebase(${
                (name, email, phone)
              })" class="action-link">
                <img src="./assets/icons/delete.svg" alt="" class="action-icon" />
                Delete
              </button>
            </div>
          </div>
        </div>
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
      </div>
    `;

  contactInfoContainer.innerHTML = detailsHTML;
}

function getOverlay() {
  return `
          <div class="overlay">
            <div class="overlay-left">
              <div class="logo1">
                <img
                  class="logoInnerOverlay"
                  src="./assets/icons/Logo-side-bar.png"
                  alt=""
                />
              </div>
              <h1 class="f1">Add contact</h1>
              <p class="f4 font-weight: none;">Tasks are better with a team!</p>
              <hr />
            </div>
            <div class="overlay-right">
              <div onclick="toggleOverlay()" class="close-btn">×</div>
              <div class="form-container">
                <img class="avatar" src="./assets/icons/Group 13.svg" alt="" />
                <form>
                  <div class="form-group">
                    <input
                      id="inputName"
                      type="text"
                      placeholder="Name"
                      required
                    />
                    <i class="icon-user"></i>
                  </div>
                  <div class="form-group">
                    <input
                      id="inputMail"
                      type="text"
                      placeholder="Email"
                      required
                    />
                    <i class="icon-email"></i>
                  </div>
                  <div class="form-group">
                    <input
                      id="inputCall"
                      type="text"
                      placeholder="Phone"
                      required
                    />
                    <i class="icon-phone"></i>
                  </div>
                  <div class="button-group">
                    <button
                      onclick="toggleOverlay()"
                      type="button"
                      class="cancel-btn"
                    >
                      Cancel<img src="./assets/icons/cancel.svg" />
                    </button>
                    <button id="addContactButton" onclick="addNewContactToFirebase()" type="button" class="create-btn">
                      Create contact <img src="./assets/icons/check.svg" alt="" />
                    </button>
                  </div>
                  <div><h2 id="addFont" class="f2 dNone addFont">Bitte alle Felder ausfüllen!</h2></div>
                </form>
              </div>
            </div>
          </div>
        `;
}

function getEditOverlay(name, email, phone) {
  return `
          <div class="overlay">
            <div class="overlay-left">
              <div class="logo1">
                <img
                  class="logoInnerOverlay"
                  src="./assets/icons/Logo-side-bar.png"
                  alt=""
                />
              </div>
              <h1 class="f1">Edit contact</h1>
              <hr />
            </div>
            <div class="overlay-right">
              <div onclick="toggleEditOverlay()" class="close-btn">×</div>
              <div class="form-container">
                <img class="avatar" src="./assets/icons/Group 13.svg" alt="" />
                <form>
                  <div class="form-group">
                    <input
                      id="inputEditName"
                      type="text"
                      placeholder="Name"
                      required
                    />
                    <i class="icon-user"></i>
                  </div>
                  <div class="form-group">
                    <input
                      id="inputEditMail"
                      type="text"
                      placeholder="Email"
                      required
                    />
                    <i class="icon-email"></i>
                  </div>
                  <div class="form-group">
                    <input
                      id="inputEditCall"
                      type="text"
                      placeholder="Phone"
                      required
                    />
                    <i class="icon-phone"></i>
                  </div>
                  <div class="button-group">
                    <button
                      onclick="toggleEditOverlay()"
                      type="button"
                      class="cancel-btn"
                    >
                      Delete<img src="./assets/icons/cancel.svg" />
                    </button>
                    <button id="addContactButton" onclick="UpdateNewContactToFirebase(['${name}', '${email}', '${phone}'])" type="button" class="create-btn">
                      Save <img src="./assets/icons/check.svg" alt="" />
                    </button>
                  </div>
                  <div><h2 id="addFont" class="f2 dNone addFont">Bitte alle Felder ausfüllen!</h2></div>
                </form>
              </div>
            </div>
          </div>
        `;
}
