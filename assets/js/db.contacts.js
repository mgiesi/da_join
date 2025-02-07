/**
 * Base URL for contacts, composed of the database base URL and the "contacts/" path.
 * Ensure that DB_BASE_URL is available by including db.js.
 * @constant {string}
 */
const CONTACTS_URL = DB_BASE_URL + "contacts/";

/**
 * Retrieves all contacts from the database.
 *
 * This function sends a GET request to the URL that returns all contacts in JSON format.
 *
 * @async
 * @function getContacts
 * @returns {Promise<Object>} A promise that resolves to an object containing all contacts.
 */
async function getContacts() {
    let response = await fetch(CONTACTS_URL + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Retrieves a specific contact by its ID.
 *
 * This function sends a GET request to the URL that returns a single contact in JSON format.
 * The ID of an contact is in the format "contactXX" where XX is a number starting from 1.
 *
 * @async
 * @function getContact
 * @param {string|number} contactId - The unique ID of the contact to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to an object containing the contact details.
 */
async function getContact(contactId) {
    let response = await fetch(CONTACTS_URL + "contact" + contactId + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Adds a new contact or updates an existing contact in the database.
 *
 * This function sends a PUT request to the URL to store the contact under a specific key.
 * The ID of an contact is in the format "contactXX" where XX is a number starting from 1.
 *
 * @async
 * @function addOrUpdateContact
 * @param {string} contactKey - The key or ID under which the contact will be stored.
 * @param {Object} contact - The contact object to be stored.
 * @returns {Promise<Response>} A promise that resolves to the response object of the PUT request.
 */
async function addOrUpdateContact(contactKey, contact) {
    const response = await fetch(
        `${CONTACTS_URL}/${contactKey}.json`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contact),
        }
    );
    return response;
}

/**
 * Deletes a specific contact from the database.
 *
 * This function sends a DELETE request to the URL corresponding to the contact's key.
 * The ID of an contact is in the format "contactXX" where XX is a number starting from 1.
 *
 * @async
 * @function deleteContact
 * @param {string} contactKey - The key or ID of the contact to be deleted.
 * @returns {Promise<Response>} A promise that resolves to the response of the DELETE request.
 */
async function deleteContact(contactKey) {
    const response = await fetch(
        `${CONTACTS_URL}/${contactKey}.json`,
        {
            method: "Delete",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(),
        }
    );
    return response;
}

/**
 * Generates a shortcut name from a contact's name.
 *
 * This function takes a contact object and returns a string composed of the uppercase initials
 * of each word in the contact's name. If the contact is null, an empty string is returned.
 *
 * @function getShortcutName
 * @param {Object|null} contact - The contact object containing a "name" property, or null.
 * @returns {string} A string representing the initials of the contact's name, or an empty string if the contact is null.
 */
function getShortcutName(contact) {
    if (contact === null) {
        return "";
    }

    return contact.name
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("");
}