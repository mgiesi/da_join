function displayContactDetails(key, name, email, phone, avatarColor) {
  const contactInfoContainer = document.querySelector(".contact-info");

  avatarColor = avatarColor;

  const detailsHTML = `
      <div class="contact-info-header">
          <h1>Contacts</h1>
          <div class="header-divider"></div>
          <span class="header-subtitle">Better with a team</span>
          
        </div>
        <img onclick="onHideContactInfoClicked()" class="respArrow" src="./assets/icons/arrow-left-line.svg" alt="">
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
              <button class="action-link" onclick="toggleEditOverlay('${key}','${name}', '${email}', '${phone}')">
                <img src="./assets/icons/edit.svg" alt="" class="action-icon" />
                Edit
              </button>
              <button onclick="deleteContactToFirebase('${key}')" class="action-link">
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
      <img onclick="toggleDropdown(event)" class="exportMenu" src="./assets/icons/Menu Contact options.svg" alt="">
      <div id="dropdownMenu" class="dropdown-overlay-content "><a onclick="toggleEditOverlay('${key}','${name}', '${email}', '${phone}')">Edit</a>
      <a onclick="deleteContactToFirebase('${key}')">Delete</a></div>
    `;

  contactInfoContainer.innerHTML = detailsHTML;
  let info = document.getElementById("contact-info");
  if (window.innerWidth <= 1200) info.classList.remove("dNone");
  scrollToTop();
}

function getOverlay() {
  return `
          <div class="overlay">
            <div class="overlay-left">
            <div onclick="toggleOverlay()" class="respClose-Btn">×</div>
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
                <form id="contact-form">
                  <div class="form-group">
                    <input
                      id="inputName"
                      type="text"
                      placeholder="Name"
                      required
                      minlength="3"
                    />
                    <i class="icon-user"></i>
                    <div><p id="nameWarning" class="dNone addFont">Name: at least 3 letters, no numbers.</p></div>
                  </div>
                  <div class="form-group">
                    <input
                      id="inputMail"
                      type="email"
                      placeholder="YourEmail@example.com"
                      required
                    />
                    <i class="icon-email"></i>
                    <div><p id="nameEWarning" class="fS dNone addFont">Please use a correct email address.</p></div>
                  </div>
                  <div class="form-group">
                    <input
                      id="inputCall"
                      type="phone"
                      placeholder="Phone"
                      required
                    />
                    <i class="icon-phone"></i>
                    <div><p id="namePhoneWarning" class="fS dNone addFont">Please use a correct PhoneNumber.</p></div>
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
                </form>
              </div>
            </div>
          </div>
        `;
}

function getEditOverlay(key, name, email, phone) {
  return `
          <div class="overlay">
            <div class="overlay-left">
            <div onclick="toggleEditOverlay()" class="respClose-Btn">×</div>
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
                <form id="contact-form">
                  <div class="form-group">
                    <input
                      value="${name}"
                      id="inputEditName"
                      type="text"
                      placeholder="Name"
                      required
                    />
                    <i class="icon-user"></i>
                    <div><p id="nameWarning" class="fS dNone addFont">Name: at least 3 letters, no numbers.</p></div>
                  </div>
                  <div class="form-group">
                    <input
                      value="${email}"
                      id="inputEditMail"
                      type="text"
                      placeholder="Email"
                      required
                    />
                    <i class="icon-email"></i>
                    <div><p id="nameEWarning" class="fS dNone addFont">Please use a correct email address.</p></div>
                  </div>
                  <div class="form-group">
                    <input
                      value="${phone}"
                      id="inputEditCall"
                      type="text"
                      placeholder="Phone"
                      required
                    />
                    <i class="icon-phone"></i>
                    <div><p id="nameEPhoneWarning" class="fS dNone addFont">Please use a correct PhoneNumber.</p></div>
                  </div>
                  <div class="button-group">
                    <button
                      onclick="deleteContactToFirebaseWithDialogRemove('${key}')""
                      type="button"
                      class="cancel-btn"
                    >
                      Delete<img src="./assets/icons/cancel.svg" />
                    </button>
                    <button id="addContactButton" onclick="UpdateNewContactToFirebase('${key}')" name="submit" type="button" class="create-btn">
                      Save <img src="./assets/icons/check.svg" alt="" />
                    </button>
                  </div>
                  
                  
                  
                </form>
              </div>
            </div>
          </div>
        `;
}

document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (event) {
    let contact = event.target.closest(".contact");
    if (!contact) return;
    document
      .querySelectorAll(".contact.active")
      .forEach((c) => c.classList.remove("active"));
    contact.classList.add("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const contactInfo = document.querySelector(".contact-info");

  function showContactInfo(contact) {
    document
      .querySelectorAll(".contact.active")
      .forEach((c) => c.classList.remove("active"));
    contact.classList.add("active");
    contactInfo.style.visibility = "visible";
    contactInfo.style.opacity = "1";
  }

  function hideContactInfo() {
    contactInfo.style.visibility = "hidden";
    contactInfo.style.opacity = "0";
  }

  function handleContactClick(event) {
    let contact = event.target.closest(".contact");
    contact ? showContactInfo(contact) : hideContactInfo();
  }

  function checkScreenSize() {
    if (window.innerWidth <= 1530) {
      document.body.addEventListener("click", handleContactClick);
    } else {
      document.body.removeEventListener("click", handleContactClick);
      contactInfo.style.visibility = "visible";
      contactInfo.style.opacity = "1";
    }
  }

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

function controlValidation() {
  let name = document.getElementById("inputName");
  let inputValue = name.value.trim();

  if (/[0-9]/.test(inputValue) || /^[A-Za-z]{1,2}$/.test(inputValue)) {
    document.getElementById("nameWarning").classList.remove("dNone");
    return false;
  }

  return true;
}

function emailValidation() {
  let email = document.getElementById("inputMail");
  let inputValue = email.value.trim();
  let warning = document.getElementById("nameEWarning");

  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(inputValue)) {
    warning.classList.remove("dNone");
    warning.textContent = "Please use a correct email adress.";
    return false;
  }

  warning.classList.add("dNone");
  return true;
}

function phoneValidation() {
  let phone = document.getElementById("inputCall");
  let inputValue = phone.value.trim();
  let warning = document.getElementById("namePhoneWarning");

  let phonePattern = /^[0-9]{3,}$/;

  if (!phonePattern.test(inputValue)) {
    warning.classList.remove("dNone");
    warning.textContent = "Please use a correct PhoneNumber.";
    return false;
  }

  warning.classList.add("dNone");
  return true;
}

function editControlValidation() {
  let name = document.getElementById("inputEditName");
  let inputValue = name.value.trim();

  if (/[0-9]/.test(inputValue) || /^[A-Za-z]{1,2}$/.test(inputValue)) {
    document.getElementById("nameWarning").classList.remove("dNone");
    return false;
  }

  return true;
}

function editEmailValidation() {
  let email = document.getElementById("inputEditMail");
  let inputValue = email.value.trim();
  let warning = document.getElementById("nameEWarning");

  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(inputValue)) {
    warning.classList.remove("dNone");
    warning.textContent = "Please use a correct email adress.";
    return false;
  }

  warning.classList.add("dNone");
  return true;
}

function editPhoneValidation() {
  let phone = document.getElementById("inputEditCall");
  let inputValue = phone.value.trim();
  let warning = document.getElementById("nameEPhoneWarning");

  let phonePattern = /^[0-9]{3,}$/;

  if (!phonePattern.test(inputValue)) {
    warning.classList.remove("dNone");
    warning.textContent = "Please use a correct PhoneNumber.";
    return false;
  }

  warning.classList.add("dNone");
  return true;
}
