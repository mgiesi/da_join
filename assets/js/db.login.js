/**
 * Base URL for contacts, composed of the database base URL and the "contacts/" path.
 * Ensure that DB_BASE_URL is available by including db.js.
 * @constant {string}
 */
const DB_BASE_URL =
  "https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/";
const USER_URL = DB_BASE_URL + "user/";

/**
 * Retrieves all contacts from the database.
 *
 * This function sends a GET request to the URL that returns all contacts in JSON format.
 *
 * @async
 * @function getContacts
 * @returns {Promise<Object>} A promise that resolves to an object containing all contacts.
 */
async function getUser() {
  let response = await fetch(USER_URL + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}
