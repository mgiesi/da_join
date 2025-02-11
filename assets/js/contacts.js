function toggleOverlay() {
  let overlay = document.getElementById("overlayAddContact");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getOverlay();
}

function toggleEditOverlay(key, name, email, phone) {
  const overlay = document.getElementById("overlayEditContact");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getEditOverlay(key, name, email, phone);
}

function initPlus() {
  init();
  loadContactsFromFirebase();
}

async function addNewContactToFirebase() {
  const name = document.getElementById("inputName").value;
  const email = document.getElementById("inputMail").value;
  const phone = document.getElementById("inputCall").value;

  if (!name || !email || !phone) {
    let addDialog = document.getElementById("addFont");
    addDialog.classList.remove("dNone");
    return;
  }

  const newContact = {
    name,
    email,
    phone,
    avatarColor: getRandomColor(),
  };

  try {
    const contacts = await getContacts();
    const contactKeys = contacts ? Object.keys(contacts) : [];
    const nextNumber = contactKeys.length + 1;
    const newContactKey = `contact${nextNumber}`;

    const saveResponse = await addOrUpdateContact(newContactKey, newContact);
    if (!saveResponse.ok) {
      throw new Error(
        `Fehler beim Speichern des Kontakts: ${saveResponse.status}`
      );
    }
    await loadContactsFromFirebase();
    toggleOverlay();
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts:", error);
  }
}

async function UpdateNewContactToFirebase(contactKey) {
  const name = document.getElementById("inputEditName").value;
  const email = document.getElementById("inputEditMail").value;
  const phone = document.getElementById("inputEditCall").value;

  if (!name || !email || !phone) {
    let addDialog = document.getElementById("addFont");
    addDialog.classList.remove("dNone");
    return;
  }

  if (!contactKey) {
    console.error("Fehler: Kein gültiger contactKey gefunden!");
    alert("Fehler: Kein gültiger Kontakt zum Bearbeiten gefunden.");
    return;
  }

  const updatedContact = {
    name,
    email,
    phone,
    avatarColor: getRandomColor(),
  };

  try {
    const saveResponse = await fetch(
      `https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/contacts/${contactKey}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact),
      }
    );

    if (!saveResponse.ok) {
      throw new Error(
        `Fehler beim Speichern des Kontakts: ${saveResponse.status}`
      );
    }

    await loadContactsFromFirebase();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
    alert(
      "Es ist ein Fehler aufgetreten. Kontakt konnte nicht aktualisiert werden."
    );
  }
}

async function deleteContactToFirebase(key) {
  try {
    const saveResponse = await deleteContact(key);
    if (!saveResponse.ok) {
      throw new Error(
        `Fehler beim Löschen des Kontakts: ${saveResponse.status}`
      );
    }
    await loadContactsFromFirebase();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

function getRandomColor() {
  const colors = ["#273DB4", "#C50900", "#F95CA4", "#ED7845", "#124E66"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}

async function loadContactsFromFirebase() {
  try {
    const contacts = await getContacts();

    const sortedContacts = Object.entries(contacts).sort(([_, a], [__, b]) =>
      a.name.localeCompare(b.name)
    );

    const contactSections = document.querySelector(".contact-sections");
    contactSections.innerHTML = "";

    sortedContacts.forEach(([key, contact]) => {
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
      const color = contact.avatarColor || "#CCCCCC";

      const contactDiv = document.createElement("div");
      contactDiv.classList.add("contact");
      contactDiv.innerHTML = `
        <div class="contact-avatar" style="background-color: ${color}">
          <span>${avatarInitials}</span>
        </div>
        <div class="contact-details">
          <span class="contact-name">${contact.name}</span>
          <span class="contact-email">${contact.email}</span>
        </div>
      `;
      contactDiv.addEventListener("click", () =>
        displayContactDetails(
          key,
          contact.name,
          contact.email,
          contact.phone,
          contact.avatarColor
        )
      );

      section.appendChild(contactDiv);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}
