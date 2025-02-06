const CONTACTS_URL = DB_BASE_URL + "contacts/";

async function getContacts() {
    let response = await fetch(CONTACTS_URL + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

async function getContact(contactId) {
    let response = await fetch(CONTACTS_URL + "contact" + contactId + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

function getShortcutName(contact) {
    if (contact === null) {
        return "";
    }

    return contact.name
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("");
}