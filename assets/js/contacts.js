function toggleOverlay() {
  let overlay = document.getElementById("overlayAddContact");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getOverlay();
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
                  <button id="addContactButton" onclick="addContact()" type="button" class="create-btn">
                    Create contact <img src="./assets/icons/check.svg" alt="" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
}
//const Base_URL =
//  "https://joinusercontacts-default-rtdb.europe-west1.firebasedatabase.app/";

//async function test() {
//  let response = await fetch(Base_URL,
//  );
//  let responseToJson = await response.json();
//  console.log(responseToJson);
//}

async function getAllInformations() {
  let response = await fetch(`./doc/db-structure.json`);
  let responseToJson = await response.json();
  return responseToJson;
}

async function displayContacts() {
  const data = await getAllInformations();
  const contacts = data.contacts;
  const contactsContainer = document.getElementById("contactsContainer");
  for (const contactId in contacts) {
    const contact = contacts[contactId];
    const contactElement = document.createElement("div");
    contactElement.classList.add("contact");
    contactElement.innerHTML = `
      <h3>${contact.name}</h3>
      <p>Phone: ${contact.phone}</p>
      <p>Email: ${contact.email}</p>
    `;
    contactsContainer.appendChild(contactElement);
  }
}
