/**
 * Firebase operations for the contacts module
 */

/**
 * Adds a new contact to Firebase.
 */
async function addNewContactToFirebase() {
    const { name, email, phone } = getContactInput();

    if (!validateAllContactInputs(name, email, phone)) return;

    const newContact = createNewContact(name, email, phone);
    await saveAndLoadContact(newContact);
}

/**
 * Validates all contact inputs.
 */
function validateAllContactInputs(name, email, phone) {
    if (!validateContactInput(name, email, phone)) return false;
    if (!controlValidation(name, email, phone)) return false;
    if (!emailValidation(name, email, phone)) return false;
    if (!phoneValidation(name, email, phone)) return false;
    if (!validateInputs(name, email, phone)) return false;
    return true;
}

/**
 * Saves the new contact to Firebase and reloads the contact list.
 */
async function saveAndLoadContact(newContact) {
    try {
        const newContactKey = await generateContactKey();
        await saveNewContact(newContactKey, newContact);
        await finalizeContactAddition();
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Kontakts:", error);
    }
}

/**
 * Saves a new contact to Firebase.
 */
async function saveNewContact(contactKey, contact) {
    const saveResponse = await addOrUpdateContact(contactKey, contact);
    if (!saveResponse.ok) {
        throw new Error(`Fehler: ${saveResponse.status}`);
    }
}

/**
 * Finalizes the contact addition process.
 */
async function finalizeContactAddition() {
    await loadContactsFromFirebase();
    toggleOverlay();
    showAddMessage();
}

/**
 * Updates an existing contact in Firebase.
 */
async function UpdateNewContactToFirebase(contactKey) {
    const name = document.getElementById("inputEditName").value;
    const email = document.getElementById("inputEditMail").value;
    const phone = document.getElementById("inputEditCall").value;

    if (!validateAllEditInputs(name, email, phone)) return;

    if (!contactKey) return showInvalidContactError();

    try {
        const updatedContact = createUpdatedContact(name, email, phone);
        await saveContactToFirebase(contactKey, updatedContact);
        await finalizeUpdate(contactKey, name, email, phone, updatedContact.avatarColor);
    } catch (error) {
        handleUpdateError(error);
    }
}

/**
 * Validates all edit inputs.
 */
function validateAllEditInputs(name, email, phone) {
    if (!validateEditInputs()) return false;
    if (!editControlValidation(name, email, phone)) return false;
    if (!editEmailValidation(name, email, phone)) return false;
    if (!editPhoneValidation(name, email, phone)) return false;
    return true;
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
 * Deletes a contact from Firebase.
 */
async function deleteContactToFirebase(key) {
    try {
        await deleteContactAndUpdateUI(key);
        clearContactInfo();
        addDNoneToResp();
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}

/**
 * Deletes a contact and updates the UI.
 */
async function deleteContactAndUpdateUI(key) {
    const saveResponse = await deleteContact(key);
    if (!saveResponse.ok) {
        throw new Error(`Fehler beim Löschen des Kontakts: ${saveResponse.status}`);
    }
    await loadContactsFromFirebase();
}

/**
 * Clears the contact info container.
 */
function clearContactInfo() {
    const contactInfoContainer = document.querySelector(".contact-info");
    contactInfoContainer.innerHTML = "";
}

/**
 * Deletes a contact and removes the dialog.
 */
async function deleteContactToFirebaseWithDialogRemove(key) {
    try {
        await deleteContactAndUpdateUI(key);
        hideEditOverlay();
        clearContactInfo();
        onHideContactInfoClicked();
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}

/**
 * Hides the edit overlay.
 */
function hideEditOverlay() {
    const overlay = document.getElementById("overlayEditContact");
    overlay.classList.add("dNone");
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

/**
 * Generates a unique key for the new contact.
 */
async function generateContactKey() {
    const contacts = await getContacts();
    const nextNumber = (contacts ? Object.keys(contacts).length : 0) + 1;
    return `contact${nextNumber}`;
}
