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
  const { name, email, phone } = getContactInput();
  if (!validateContactInput(name, email, phone)) return;

  const newContact = createNewContact(name, email, phone);
  await saveAndLoadContact(newContact);
}

function getContactInput() {
  return {
    name: document.getElementById("inputName").value,
    email: document.getElementById("inputMail").value,
    phone: document.getElementById("inputCall").value,
  };
}

function validateContactInput(name, email, phone) {
  if (!name || !email || !phone) {
    document.getElementById("addFont").classList.remove("dNone");
    return false;
  }
  return true;
}

function createNewContact(name, email, phone) {
  return { name, email, phone, avatarColor: getRandomColor() };
}

async function saveAndLoadContact(newContact) {
  try {
    const newContactKey = await generateContactKey();
    const saveResponse = await addOrUpdateContact(newContactKey, newContact);
    if (!saveResponse.ok) throw new Error(`Fehler: ${saveResponse.status}`);

    await loadContactsFromFirebase();
    toggleOverlay();
    showAddMessage();
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts:", error);
  }
}

async function generateContactKey() {
  const contacts = await getContacts();
  const nextNumber = (contacts ? Object.keys(contacts).length : 0) + 1;
  return `contact${nextNumber}`;
}

async function UpdateNewContactToFirebase(contactKey) {
  const name = document.getElementById("inputEditName").value;
  const email = document.getElementById("inputEditMail").value;
  const phone = document.getElementById("inputEditCall").value;

  if (!name || !email || !phone) return showAddDialog();
  if (!contactKey) return showInvalidContactError();
  const updatedContact = createUpdatedContact(name, email, phone);
  try {
    await saveContactToFirebase(contactKey, updatedContact);
    finalizeUpdate();
  } catch (error) {
    handleUpdateError(error);
  }
}

function showAddDialog() {
  document.getElementById("addFont").classList.remove("dNone");
}

function showInvalidContactError() {
  console.error("Fehler: Kein gültiger contactKey gefunden!");
  alert("Fehler: Kein gültiger Kontakt zum Bearbeiten gefunden.");
}

function createUpdatedContact(name, email, phone) {
  return { name, email, phone, avatarColor: getRandomColor() };
}

async function saveContactToFirebase(contactKey, updatedContact) {
  const response = await fetch(
    `https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/contacts/${contactKey}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact),
    }
  );
  if (!response.ok) {
    throw new Error(`Fehler beim Speichern des Kontakts: ${response.status}`);
  }
}

async function finalizeUpdate() {
  toggleEditOverlay();
  document.querySelector(".contact-info").innerHTML = "";
  await loadContactsFromFirebase();
}

function handleUpdateError(error) {
  console.error("Fehler beim Aktualisieren des Kontakts:", error);
  alert(
    "Es ist ein Fehler aufgetreten. Kontakt konnte nicht aktualisiert werden."
  );
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
    const contactInfoContainer = document.querySelector(".contact-info");
    contactInfoContainer.innerHTML = "";
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

async function deleteContactToFirebaseWithDialogRemove(key) {
  try {
    const saveResponse = await deleteContact(key);
    if (!saveResponse.ok) {
      throw new Error(
        `Fehler beim Löschen des Kontakts: ${saveResponse.status}`
      );
    }
    await loadContactsFromFirebase();
    const overlay = document.getElementById("overlayEditContact");
    overlay.classList.add("dNone");
    const contactInfoContainer = document.querySelector(".contact-info");
    contactInfoContainer.innerHTML = "";
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
    const sortedContacts = sortContactsByName(contacts);
    const contactSections = document.querySelector(".contact-sections");
    contactSections.innerHTML = "";
    sortedContacts.forEach(([key, contact]) => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      let section = findOrCreateSection(firstLetter, contactSections);
      appendContactToSection(section, key, contact);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

function sortContactsByName(contacts) {
  return Object.entries(contacts).sort(([_, a], [__, b]) =>
    a.name.localeCompare(b.name)
  );
}

function findOrCreateSection(firstLetter, container) {
  let section = document.querySelector(
    `.contact-section[data-letter="${firstLetter}"]`
  );

  if (!section) {
    section = document.createElement("div");
    section.classList.add("contact-section");
    section.setAttribute("data-letter", firstLetter);
    section.innerHTML = createSectionHTML(firstLetter);
    container.appendChild(section);
  }
  return section;
}

function createSectionHTML(firstLetter) {
  return `
    <div class="section-header">${firstLetter}</div>
    <div class="contact-divider"></div>
  `;
}

function appendContactToSection(section, key, contact) {
  const contactDiv = createContactElement(key, contact);
  section.appendChild(contactDiv);
}

function createContactElement(key, contact) {
  const avatarInitials = getAvatarInitials(contact.name);
  const color = contact.avatarColor || "#CCCCCC";
  const contactDiv = document.createElement("div");
  contactDiv.classList.add("contact");
  contactDiv.innerHTML = createContactHTML(avatarInitials, color, contact);
  contactDiv.addEventListener("click", () =>
    displayContactDetails(
      key,
      contact.name,
      contact.email,
      contact.phone,
      contact.avatarColor
    )
  );

  return contactDiv;
}

function getAvatarInitials(name) {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
}

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

function showAddMessage() {
  document.getElementById("overlayContactSuccess").classList.remove("dNone");
  overlayContactSuccess.classList.add("animate");
  setTimeout(function () {
    document.getElementById("overlayContactSuccess").classList.add("dNone");
  }, 2000);
}

function addDNoneToResp() {
  let info = document.getElementById("contact-info");
  if (window.innerWidth <= 1200) info.classList.add("dNone");
}
