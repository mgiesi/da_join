/**
 * Base URL for users, composed of the database base URL and the "users/" path.
 * Ensure that DB_BASE_URL is available by including db.js.
 * @constant {string}
 */
const USERS_URL = DB_BASE_URL + "user/";

/**
 * Retrieves a user object matching the provided email address.
 *
 * This function fetches user data from a JSON endpoint (constructed from the USERS_URL constant)
 * and converts the response to JSON. It then searches through the returned data for a user
 * whose `email` property matches the given email. If no data is retrieved or no matching user is found,
 * the function returns `undefined`.
 *
 * @async
 * @param {string} email - The email address to search for.
 * @returns {Promise<Object|undefined>} A promise that resolves to the user object if found; otherwise, `undefined`.
 */
async function getUser(email) {
    const response = await fetch(USERS_URL + ".json");
    const responseToJson = await response.json();

    if (!responseToJson) {
        return;
    }

    const user = Object.values(responseToJson).find((u) =>
        u.email === email
    );
    
    return user;
}