/** @type {Object} Object to store contacts data */
let contacts = {};
/** @type {Array} Array to store selected contact IDs */
let selectedContacts = [];

/**
 * Fetches contacts data from the Firebase database
 * @returns {Promise<void>}
 */
async function fetchContacts() {
    try {
        const response = await fetch('https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        contacts = data || {};
        renderContactsList();
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

/**
 * Gets the list of assigned contacts
 * @returns {Object} Object with contact IDs as keys
 */
function getAssignedContacts() {
    const assignedTo = {};
    selectedContacts.forEach(id => {
        assignedTo[id] = true;
    });
    return assignedTo;
}

/**
 * Toggles the visibility of the contact selection dropdown
 */
function toggleContactDropdown() {
    const list = document.getElementById('contactList');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
}

/**
 * Renders the list of contacts in the dropdown
 */
function renderContactsList() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    const sortedContacts = getSortedContacts();
    sortedContacts.forEach(([id, contact]) => {
        const contactDiv = createContactDiv(id, contact);
        contactList.innerHTML += contactDiv;
    });
}

/**
 * Gets contacts sorted alphabetically by name
 * @returns {Array} Array of sorted contact entries
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
    return `
        <div class="contact-item" onclick="toggleContactSelection('${id}')">
            <div class="contact-info-container">
                <div class="contact-avatar" style="background-color: ${contact.avatarColor || '#000000'}">
                    ${initials}
                </div>
                <div class="contact-name">${contact.name}</div>
            </div>
            <input type="checkbox" class="contact-checkbox" ${selectedContacts.includes(id) ? 'checked' : ''}>
        </div>
    `;
}

/**
 * Toggles selection state of a contact
 * @param {string} contactId - ID of the contact to toggle
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
 */
function updateSelectedDisplay() {
    const searchInput = document.getElementById('contactSearch');
    searchInput.value = '';
    searchInput.placeholder = 'Select contacts to assign';
}

/**
 * Updates the display of selected contact avatars
 */
function updateSelectedAvatars() {
    const avatarDiv = document.getElementById('selectedContactsAvatar');
    if (!avatarDiv) return;
    avatarDiv.innerHTML = '';
    selectedContacts.forEach(contactId => {
        const contact = contacts[contactId];
        if (contact) {
            const initials = getInitials(contact.name);
            const avatarElement = createAvatarElement(contact, initials);
            avatarDiv.appendChild(avatarElement);
        }
    });
}

/**
 * Creates an avatar element for a contact
 * @param {Object} contact - Contact object
 * @param {string} initials - Contact initials
 * @returns {HTMLElement} Avatar DOM element
 */
function createAvatarElement(contact, initials) {
    const avatarElement = document.createElement('div');
    avatarElement.className = 'contact-avatar-selected';
    avatarElement.style.backgroundColor = contact.avatarColor || '#000000';
    avatarElement.textContent = initials;
    return avatarElement;
}

/**
 * Extracts initials from a full name
 * @param {string} name - Full name
 * @returns {string} Initials in uppercase
 */
function getInitials(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
}

/**
 * Clears all selected contact avatars
 */
function clearSelectedAvatars() {
    const avatarDiv = document.getElementById('selectedContactsAvatar');
    if (avatarDiv) {
        avatarDiv.innerHTML = '';
    }
}
