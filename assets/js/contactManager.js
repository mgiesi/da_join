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
 * Toggles the contact dropdown visibility and rotates the arrow
 */
function toggleContactDropdown() {
    const dropdown = document.querySelector('.contact-dropdown');
    dropdown.classList.toggle('open');
    const contactList = document.getElementById('contactList');

    if (dropdown.classList.contains('open')) {
        contactList.style.display = 'block';
        // Apply current filter
        const searchInput = document.getElementById('contactSearch');
        filterContactsList(searchInput.value);
    } else {
        contactList.style.display = 'none';
    }
}

/**
 * Closes the contact dropdown when clicking outside
 */
document.addEventListener('click', function (event) {
    const dropdown = document.querySelector('.contact-dropdown');
    const selectWrapper = document.querySelector('.select-wrapper');

    if (dropdown && !dropdown.contains(event.target) ||
        (event.target !== selectWrapper && !selectWrapper.contains(event.target))) {
        dropdown.classList.remove('open');
        document.getElementById('contactList').style.display = 'none';
    }
});

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
    const isSelected = selectedContacts.includes(id);

    return `
        <div class="contact-item" onclick="toggleContactSelection('${id}')">
            <div class="contact-info-container">
                <div class="contact-avatar" style="background-color: ${contact.avatarColor || '#000000'}">
                    ${initials}
                </div>
                <div class="contact-name">${contact.name}</div>
            </div>
            <div class="check-button-container ${isSelected ? 'selected' : ''}">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4.38818" y="4" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
                    ${isSelected ? '<path d="M7.38818 12L11.3882 16L17.3882 8" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
                </svg>
            </div>
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

/**
 * Filters the contacts list based on input text
 * @param {string} searchText - Text to filter contacts by
 */
function filterContactsList(searchText) {
    // Make sure dropdown is visible when typing
    const contactList = document.getElementById('contactList');
    contactList.style.display = 'block';

    // Add open class to dropdown
    const dropdown = document.querySelector('.contact-dropdown');
    if (dropdown) {
        dropdown.classList.add('open');
    }

    // Get all contacts
    const contacts = getSortedContacts();

    // Clear the current list
    contactList.innerHTML = '';

    // Filter contacts and add to list
    const searchLower = searchText.toLowerCase();
    contacts.forEach(([id, contact]) => {
        if (!searchText || (contact && contact.name && contact.name.toLowerCase().includes(searchLower))) {
            const contactDiv = createContactDiv(id, contact);
            contactList.innerHTML += contactDiv;
        }
    });
}
