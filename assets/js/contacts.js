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

async function addNewContactToFirebase() {
  const name = document.getElementById("inputName").value;
  const email = document.getElementById("inputMail").value;
  const phone = document.getElementById("inputCall").value;
  if (!name || !email || !phone) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  const newContact = {
    name: name,
    email: email,
    phone: phone,
  };

  try {
    const response = await fetch(
      "https://joinusercontacts-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
    );

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Kontakte: ${response.status}`);
    }

    const contacts = await response.json();
    const contactKeys = contacts ? Object.keys(contacts) : [];
    const nextNumber = contactKeys.length + 1;
    const newContactKey = `contact${nextNumber}`;
    const saveResponse = await fetch(
      `https://joinusercontacts-default-rtdb.europe-west1.firebasedatabase.app/contacts/${newContactKey}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      }
    );

    if (!saveResponse.ok) {
      throw new Error(
        `Fehler beim Speichern des Kontakts: ${saveResponse.status}`
      );
    }
    addContactToDOM(newContact);
    alert("Kontakt erfolgreich hinzugefügt!");
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts:", error);
    alert(
      "Es ist ein Fehler aufgetreten. Kontakt konnte nicht hinzugefügt werden."
    );
  }
}

function addContactToDOM(contact) {
  const contactSections = document.querySelector(".contact-sections");
  const { name, email } = contact;
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
  const firstLetter = name[0].toUpperCase();
  let section = document.querySelector(
    `.contact-section[data-letter="${firstLetter}"]`
  );

  if (!section) {
    section = document.createElement("div");
    section.classList.add("contact-section");
    section.setAttribute("data-letter", firstLetter);

    const sectionHeader = document.createElement("div");
    sectionHeader.classList.add("section-header");
    sectionHeader.textContent = firstLetter;

    const sectionDivider = document.createElement("div");
    sectionDivider.classList.add("contact-divider");

    section.appendChild(sectionHeader);
    section.appendChild(sectionDivider);
    contactSections.appendChild(section);
  }
  const contactDiv = document.createElement("div");
  contactDiv.classList.add("contact");

  const avatarDiv = document.createElement("div");
  avatarDiv.classList.add("contact-avatar");
  avatarDiv.style.backgroundColor = getRandomColor();
  avatarDiv.innerHTML = `<span>${initials}</span>`;

  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("contact-details");
  detailsDiv.innerHTML = `
    <span class="contact-name">${name}</span>
    <span class="contact-email">${email}</span>
  `;

  contactDiv.appendChild(avatarDiv);
  contactDiv.appendChild(detailsDiv);
  section.appendChild(contactDiv);
}
function getRandomColor() {
  const colors = ["#ff7a00", "#ff006e", "#8338ec", "#3a86ff", "#06d6a0"];
  return colors[Math.floor(Math.random() * colors.length)];
}

document.addEventListener("DOMContentLoaded", () => {
  loadContactsFromFirebase();
});

async function loadContactsFromFirebase() {
  try {
    const response = await fetch(
      "https://joinusercontacts-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
    );

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Kontakte: ${response.status}`);
    }

    const contacts = await response.json();
    if (!contacts) {
      console.log("Keine Kontakte in der Datenbank gefunden.");
      return;
    }
    const contactSections = document.querySelector(".contact-sections");

    Object.keys(contacts).forEach((key) => {
      const contact = contacts[key];
      const firstLetter = contact.name.charAt(0).toUpperCase();
      let section = document.querySelector(
        `.contact-section[data-letter="${firstLetter}"]`
      );

      if (!section) {
        section = document.createElement("div");
        section.classList.add("contact-section");
        section.setAttribute("data-letter", firstLetter);

        section.innerHTML = `
          <div class="section-header">${firstLetter}</div>
          <div class="contact-divider"></div>
        `;

        contactSections.appendChild(section);
      }
      const avatarInitials = contact.name
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("");

      const contactHTML = `
        <div class="contact">
          <div class="contact-avatar" style="background-color: #ff7a00">
            <span>${avatarInitials}</span>
          </div>
          <div class="contact-details">
            <span class="contact-name">${contact.name}</span>
            <span class="contact-email">${contact.email}</span>
          </div>
        </div>
      `;
      section.innerHTML += contactHTML;
    });
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}
