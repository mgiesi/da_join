/**
 * Validation functions for the contacts module
 */

/**
 * Validates the contact input.
 */
function validateContactInput(name, email, phone) {
    if (!name || !email || !phone) {
        return false;
    }
    return true;
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
