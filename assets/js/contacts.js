/**
 * Main contacts functionality
 */

/**
 * Initializes the application by calling essential setup functions.
 */
function initPlus() {
  init();
  loadContactsFromFirebase();
  addDNoneToResp();
  addActiveUserToContacts();
}

/**
 * Retrieves the contact input data from the form fields.
 */
function getContactInput() {
  return {
    name: document.getElementById("inputName").value,
    email: document.getElementById("inputMail").value,
    phone: document.getElementById("inputCall").value,
  };
}

/**
 * Creates a new contact object with the provided details.
 */
function createNewContact(name, email, phone) {
  return { name, email, phone, avatarColor: getRandomColor() };
}

/**
 * Creates an updated contact object with the provided details.
 */
function createUpdatedContact(name, email, phone) {
  return { name, email, phone, avatarColor: getRandomColor() };
}

/**
 * Finalizes the contact update process.
 */
async function finalizeUpdate(key, name, email, phone, avatarColor) {
  toggleEditOverlay();
  displayContactDetails(key, name, email, phone, avatarColor);
  await loadContactsFromFirebase();
}

/**
 * Generates a random color for the contact avatar.
 */
function getRandomColor() {
  const colors = ["#273DB4", "#C50900", "#F95CA4", "#ED7845", "#124E66"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Loads the contacts from Firebase, sorts them, and displays them in the UI.
 */
async function loadContactsFromFirebase() {
  try {
    const contacts = await getContacts();
    renderSortedContacts(contacts);
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

/**
 * Renders sorted contacts in the UI.
 */
function renderSortedContacts(contacts) {
  const sortedContacts = sortContactsByName(contacts);
  const contactSections = document.querySelector(".contact-sections");
  contactSections.innerHTML = "";

  sortedContacts.forEach(([key, contact]) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    let section = findOrCreateSection(firstLetter, contactSections);
    appendContactToSection(section, key, contact);
  });
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