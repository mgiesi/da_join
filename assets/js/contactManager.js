/** @type {Object<string, {name: string, avatarColor: string}>} Object to store contacts data */
let contacts = {};
/** @type {Array<string>} Array to store selected contact IDs */
let selectedContacts = [];

/**
 * Fetches contacts data from the Firebase database
 * @returns {Promise<void>}
 */
async function fetchContacts() {
  try {
    const response = await fetch(
      "https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }
    const data = await response.json();
    contacts = data || {};
    renderContactsList();
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
}

/**
 * Gets the list of assigned contacts
 * @returns {Object<string, boolean>} Object with contact IDs as keys
 */
function getAssignedContacts() {
  const assignedTo = {};
  selectedContacts.forEach((id) => {
    assignedTo[id] = true;
  });
  return assignedTo;
}

/**
 * Toggles the contact dropdown visibility and rotates the arrow
 * @returns {void}
 */
function toggleContactDropdown() {
  const dropdown = document.querySelector(".contact-dropdown");
  dropdown.classList.toggle("open");
  const contactList = document.getElementById("contactList");

  if (dropdown.classList.contains("open")) {
    contactList.style.display = "block";
    // Apply current filter
    const searchInput = document.getElementById("contactSearch");
    filterContactsList(searchInput.value);
  } else {
    contactList.style.display = "none";
  }
}

/**
 * Closes the contact dropdown when clicking outside
 */
document.addEventListener("click", function (event) {
  const dropdown = document.querySelector(".contact-dropdown");
  const selectWrapper = document.querySelector(".select-wrapper");
  if (!selectWrapper) {
    return;
  }

  if (
    (dropdown && !dropdown.contains(event.target)) ||
    (event.target !== selectWrapper && !selectWrapper.contains(event.target))
  ) {
    dropdown.classList.remove("open");
    document.getElementById("contactList").style.display = "none";
  }
});

/**
 * Renders the list of contacts in the dropdown
 * @returns {void}
 */
function renderContactsList() {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";
  const sortedContacts = getSortedContacts();
  sortedContacts.forEach(([id, contact]) => {
    const contactDiv = createContactDiv(id, contact);
    contactList.innerHTML += contactDiv;
  });
}

/**
 * Gets contacts sorted alphabetically by name
 * @returns {Array<[string, {name: string, avatarColor: string}]>} Array of sorted contact entries
 */
function getSortedContacts() {
  return Object.entries(contacts)
    .filter(([_, contact]) => contact && contact.name)
    .sort((a, b) => a[1].name.localeCompare(b[1].name));
}

/**
 * Creates HTML for a contact list item
 * @param {string} id - Contact ID
 * @param {Object} contact - Contact object
 * @returns {string} HTML string for contact div
 */
function createContactDiv(id, contact) {
  const initials = getInitials(contact.name);
  const isSelected = selectedContacts.includes(id);

  return `
        <div class="contact-item" onclick="toggleContactSelection('${id}')">
            ${createContactInfoHTML(contact, initials)}
            ${createCheckboxHTML(isSelected)}
        </div>
    `;
}

/**
 * Creates HTML for contact info section
 * @param {Object} contact - Contact object with name and avatarColor properties
 * @param {string} initials - Contact initials
 * @returns {string} HTML string for contact info
 */
function createContactInfoHTML(contact, initials) {
  return `
        <div class="contact-info-container">
            <div class="contact-avatar" style="background-color: ${
              contact.avatarColor || "#000000"
            }">
                ${initials}
            </div>
            <div class="contact-name">${contact.name}</div>
        </div>
    `;
}

/**
 * Creates HTML for checkbox section
 * @param {boolean} isSelected - Whether contact is selected
 * @returns {string} HTML string for checkbox
 */
function createCheckboxHTML(isSelected) {
  return `
        <div class="check-button-container ${isSelected ? "selected" : ""}">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4.38818" y="4" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
                ${
                  isSelected
                    ? '<path d="M7.38818 12L11.3882 16L17.3882 8" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
                    : ""
                }
            </svg>
        </div>
    `;
}

/**
 * Toggles selection state of a contact
 * @param {string} contactId - ID of the contact to toggle
 * @returns {void}
 */
function toggleContactSelection(contactId) {
  const index = selectedContacts.indexOf(contactId);
  if (index === -1) {
    selectedContacts.push(contactId);
  } else {
    selectedContacts.splice(index, 1);
  }
  renderContactsList();
  updateSelectedDisplay();
  updateSelectedAvatars();
}

/**
 * Updates the contact search input display
 * @returns {void}
 */
function updateSelectedDisplay() {
  const searchInput = document.getElementById("contactSearch");
  searchInput.value = "";
  searchInput.placeholder = "Select contacts to assign";
}

/**
 * Updates the display of selected contact avatars
 * @returns {void}
 */
/**
 * Updates the display of selected contact avatars (max 5 + counter)
 * @returns {void}
 */
function updateSelectedAvatars() {
  const avatarDiv = document.getElementById("selectedContactsAvatar");
  if (!avatarDiv) return;
  avatarDiv.innerHTML = "";

  const maxToShow = 5;
  const total = selectedContacts.length;

  // Display first 5 avatars
  selectedContacts.slice(0, maxToShow).forEach(id => {
    if (contacts[id]) {
      const initials = getInitials(contacts[id].name);
      avatarDiv.appendChild(createAvatarElement(contacts[id], initials));
    }
  });

  // Add counter avatar if needed
  if (total > maxToShow) {
    const counter = document.createElement("div");
    counter.className = "contact-avatar-selected";
    counter.style.backgroundColor = "#2A3647";
    counter.textContent = "+" + (total - maxToShow);
    avatarDiv.appendChild(counter);
  }
}

/**
 * Creates an avatar element for a contact
 * @param {Object} contact - Contact object with name and avatarColor properties
 * @param {string} initials - Contact initials
 * @returns {HTMLElement} Avatar DOM element
 */
function createAvatarElement(contact, initials) {
  const avatarElement = document.createElement("div");
  avatarElement.className = "contact-avatar-selected";
  avatarElement.style.backgroundColor = contact.avatarColor || "#000000";
  avatarElement.textContent = initials;
  return avatarElement;
}

/**
 * Extracts initials from a full name
 * @param {string} name - Full name
 * @returns {string} Initials in uppercase
 */
function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * Clears all selected contact avatars
 * @returns {void}
 */
function clearSelectedAvatars() {
  const avatarDiv = document.getElementById("selectedContactsAvatar");
  if (avatarDiv) {
    avatarDiv.innerHTML = "";
  }
}

/**
 * Filters the contacts list based on input text
 * @param {string} searchText - Text to filter contacts by
 * @returns {void}
 */
function filterContactsList(searchText) {
  showContactDropdown();
  const contacts = getSortedContacts();
  renderFilteredContacts(contacts, searchText);
}

/**
 * Shows the contact dropdown
 * @returns {void}
 */
function showContactDropdown() {
  const contactList = document.getElementById("contactList");
  contactList.style.display = "block";

  const dropdown = document.querySelector(".contact-dropdown");
  if (dropdown) {
    dropdown.classList.add("open");
  }
}

/**
 * Renders filtered contacts in the list
 * @param {Array<[string, {name: string, avatarColor: string}]>} contacts - Array of contact entries
 * @param {string} searchText - Text to filter contacts by
 * @returns {void}
 */
function renderFilteredContacts(contacts, searchText) {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";

  const searchLower = searchText.toLowerCase();
  contacts.forEach(([id, contact]) => {
    if (
      !searchText ||
      (contact &&
        contact.name &&
        contact.name.toLowerCase().includes(searchLower))
    ) {
      const contactDiv = createContactDiv(id, contact);
      contactList.innerHTML += contactDiv;
    }
  });
}
