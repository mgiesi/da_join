/**
 * Base URL for user, composed of the database base URL and the "user/" path.
 * Ensure that DB_BASE_URL is available by including db.js.
 * @constant {string}
 */
const DB_BASE_URL =
  "https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/";
const USER_URL = DB_BASE_URL + "user/";

/**
 * Retrieves all user from the database.
 *
 * This function sends a GET request to the URL that returns all user in JSON format.
 *
 * @async
 * @function getContacts
 * @returns {Promise<Object>} A promise that resolves to an object containing all user.
 */
async function getUser() {
  let response = await fetch(USER_URL + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Fetches user data from the given URL.
 *
 * @async
 * @function getUserName
 * @param {string} name - The name of the user.
 * @returns {Promise<Object>} A promise that resolves to the user data in JSON format.
 * @throws {Error} If the fetch request fails.
 */
async function getUserName(name) {
  let response = await fetch(CONTACTS_URL + "user" + name + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}
