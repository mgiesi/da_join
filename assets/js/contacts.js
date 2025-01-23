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
                  <button id="addContactButton" onclick="addNewContact()" type="button" class="create-btn">
                    Create contact <img src="./assets/icons/check.svg" alt="" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
}

async function displayContacts() {
  try {
    const response = await fetch(
      "https://joinusercontacts-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
    );

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Kontakte: ${response.status}`);
    }

    const contacts = await response.json();
    if (!contacts) {
      document.getElementById("contactsContainer").innerHTML =
        "<p>Keine Kontakte vorhanden.</p>";
      return;
    }
    let contactHTML = "<ul>";
    for (const [key, contact] of Object.entries(contacts)) {
      contactHTML += `
        <li>
          <strong>${key}:</strong>
          <ul>
            <li><strong>Name:</strong> ${contact.name}</li>
            <li><strong>Email:</strong> ${contact.email}</li>
            <li><strong>Telefon:</strong> ${contact.phone}</li>
          </ul>
        </li>
      `;
    }
    contactHTML += "</ul>";
    document.getElementById("contactsContainer").innerHTML = contactHTML;
  } catch (error) {
    console.error("Fehler beim Anzeigen der Kontakte:", error);
    document.getElementById("contactsContainer").innerHTML =
      "<p>Es ist ein Fehler aufgetreten. Kontakte konnten nicht geladen werden.</p>";
  }
}

async function addNewContact() {
  const name = document.getElementById("inputName").value;
  const email = document.getElementById("inputMail").value;
  const phone = document.getElementById("inputCall").value;
  if (!name || !email || !phone) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }
  try {
    const response = await fetch(
      "https://joinusercontacts-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
    );

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Kontakte: ${response.status}`);
    }
    const existingContacts = await response.json();
    const contactNumber = existingContacts
      ? Object.keys(existingContacts).length + 1
      : 1;
    const contactKey = `contact${contactNumber}`;
    const newContact = {
      name: name,
      email: email,
      phone: phone,
    };
    const addResponse = await fetch(
      `https://joinusercontacts-default-rtdb.europe-west1.firebasedatabase.app/contacts/${contactKey}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      }
    );

    if (!addResponse.ok) {
      throw new Error(
        `Fehler beim Hinzufügen des Kontakts: ${addResponse.status}`
      );
    }
  } catch (error) {
    console.error("Fehler:", error);
    alert("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
  }
}
