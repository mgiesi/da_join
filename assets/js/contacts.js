/**
 * Toggles the visibility of the overlay for adding a contact.
 * Updates the overlay content dynamically.
 */
function toggleOverlay() {
  let overlay = document.getElementById("overlayAddContact");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getOverlay();
}

/**
 * Toggles the visibility of the overlay for editing a contact.
 * Updates the overlay content dynamically with the provided contact details.
 */
function toggleEditOverlay(key, name, email, phone) {
  const overlay = document.getElementById("overlayEditContact");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getEditOverlay(key, name, email, phone);
}

/**
 * Initializes the application by calling essential setup functions.
 * - Calls `init()` to set up initial configurations.
 * - Loads contacts from Firebase.
 * - Adjusts the responsive design elements.
 */
function initPlus() {
  init();
  loadContactsFromFirebase();
  addDNoneToResp();
  addActiveUserToContacts();
}

/**
 * Adds a new contact to Firebase.
 * Retrieves the contact data from the input fields, validates it,
 * and then saves it to Firebase.
 */
async function addNewContactToFirebase() {
  const { name, email, phone } = getContactInput();
  controlValidation();
  if (!validateContactInput(name, email, phone)) return;
  if (!controlValidation(name, email, phone)) return;
  if (!emailValidation(name, email, phone)) return;
  if (!phoneValidation(name, email, phone)) return;

  const newContact = createNewContact(name, email, phone);
  await saveAndLoadContact(newContact);
}

/**
 * Retrieves the contact input data from the form fields.
 *
 * @returns {Object} An object containing the name, email, and phone values from the form.
 */
function getContactInput() {
  return {
    name: document.getElementById("inputName").value,
    email: document.getElementById("inputMail").value,
    phone: document.getElementById("inputCall").value,
  };
}

/**
 * Validates the contact input.
 * Checks if name, email, and phone are provided, and displays an error message if not.
 */
function validateContactInput(name, email, phone) {
  if (!name || !email || !phone) {
    document.getElementById("addFont").classList.remove("dNone");
    return false;
  }
  return true;
}

/**
 * Creates a new contact object with the provided details.
 */
function createNewContact(name, email, phone) {
  return { name, email, phone, avatarColor: getRandomColor() };
}

/**
 * Saves the new contact to Firebase and reloads the contact list.
 */
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

/**
 * Generates a unique key for the new contact.
 *
 * @returns {string} The generated contact key.
 */
async function generateContactKey() {
  const contacts = await getContacts();
  const nextNumber = (contacts ? Object.keys(contacts).length : 0) + 1;
  return `contact${nextNumber}`;
}

/**
 * Updates an existing contact in Firebase with the provided details.
 */
async function UpdateNewContactToFirebase(contactKey) {
  const name = document.getElementById("inputEditName").value;
  const email = document.getElementById("inputEditMail").value;
  const phone = document.getElementById("inputEditCall").value;

  if (!name || !email || !phone) return showAddDialog();
  if (!editControlValidation(name, email, phone)) return;
  if (!editEmailValidation(name, email, phone)) return;
  if (!editPhoneValidation(name, email, phone)) return;
  if (!contactKey) return showInvalidContactError();
  const updatedContact = createUpdatedContact(name, email, phone);
  try {
    await saveContactToFirebase(contactKey, updatedContact);
    finalizeUpdate();
  } catch (error) {
    handleUpdateError(error);
  }
}

/**
 * Shows an error message when contact input is invalid.
 */
function showAddDialog() {
  document.getElementById("addFont").classList.remove("dNone");
}

/**
 * Shows an error when the provided contact key is invalid.
 */
function showInvalidContactError() {
  console.error("Fehler: Kein gültiger contactKey gefunden!");
  alert("Fehler: Kein gültiger Kontakt zum Bearbeiten gefunden.");
}

/**
 * Creates an updated contact object with the provided details.
 */
function createUpdatedContact(name, email, phone) {
  return { name, email, phone, avatarColor: getRandomColor() };
}

/**
 * Saves the updated contact to Firebase.
 */
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

/**
 * Finalizes the contact update process by reloading the contact list and hiding the edit overlay.
 */
async function finalizeUpdate() {
  toggleEditOverlay();
  document.querySelector(".contact-info").innerHTML = "";
  await loadContactsFromFirebase();
}

/**
 * Handles errors that occur during the contact update process.
 */
function handleUpdateError(error) {
  console.error("Fehler beim Aktualisieren des Kontakts:", error);
  alert(
    "Es ist ein Fehler aufgetreten. Kontakt konnte nicht aktualisiert werden."
  );
}

/**
 * Deletes a contact from Firebase.
 */
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

/**
 * Deletes a contact from Firebase and removes the contact details dialog.
 */
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

/**
 * Generates a random color for the contact avatar.
 */
function getRandomColor() {
  const colors = ["#273DB4", "#C50900", "#F95CA4", "#ED7845", "#124E66"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}

/**
 * Loads the contacts from Firebase, sorts them, and displays them in the UI.
 */
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

/**
 * Sorts the contacts by their name in alphabetical order.
 */
function sortContactsByName(contacts) {
  return Object.entries(contacts).sort(([_, a], [__, b]) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * Finds or creates a section for contacts starting with a specific letter.
 */
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

/**
 * Creates the HTML structure for a contact section.
 */
function createSectionHTML(firstLetter) {
  return `
    <div class="section-header">${firstLetter}</div>
    <div class="contact-divider"></div>
  `;
}

/**
 * Appends a contact element to a section.
 */
function appendContactToSection(section, key, contact) {
  const contactDiv = createContactElement(key, contact);
  section.appendChild(contactDiv);
}

/**
 * Creates a contact element to display in the UI.
 */
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

/**
 * Generates initials from the contact's name for the avatar.
 */
function getAvatarInitials(name) {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
}

/**
 * Creates the HTML structure for a contact.
 */
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

/**
 * Shows a success message after adding a contact.
 */
function showAddMessage() {
  document.getElementById("overlayContactSuccess").classList.remove("dNone");
  overlayContactSuccess.classList.add("animate");
  setTimeout(function () {
    document.getElementById("overlayContactSuccess").classList.add("dNone");
  }, 2000);
}

/**
 * Adjusts the UI for responsive design by adding/removing the `dNone` class.
 */
function addDNoneToResp() {
  let info = document.getElementById("contact-info");
  if (window.innerWidth <= 1200) info.classList.add("visHid");
}

/**
 * Toggles the visibility of the dropdown menu for small screens.
 */
function toggleDropdown(event) {
  event.stopPropagation();
  let dropdown = document.getElementById("dropdownMenu");

  if (window.innerWidth < 1200) {
    dropdown.classList.toggle("show");
  }
}

/**
 * Scrolls the page to the top with a smooth animation.
 */
function scrollToTop() {
  if (window.innerWidth < 1200) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Adds the currently logged-in user to the contact list.
 */
async function addActiveUserToContacts() {
  const userName = await getActiveUserName();
  const userEmail = localStorage.getItem("activeUser");
  const activeUserKey = "me";

  const userContact = {
    name: userName,
    email: userEmail,
    avatarColor: getRandomColor(),
  };
  await addOrUpdateContact(activeUserKey, userContact);
  await loadContactsFromFirebase();
}
