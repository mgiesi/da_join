/**
 * Base URL for the boards, composed of the database base URL and the "boards/" path.
 * Ensure that DB_BASE_URL is available by including db.js.
 * @constant {string}
 */
const BOARD_URL = DB_BASE_URL + "boards/";

/**
 * Retrieves all boards from the database.
 *
 * This function sends a GET request to the boards endpoint and returns the response in JSON format.
 *
 * @async
 * @function getBoards
 * @returns {Promise<Object>} A promise that resolves to an object containing all boards.
 */
async function getBoards() {
    let response = await fetch(BOARD_URL + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Retrieves the count of tasks associated with a specific board.
 *
 * This function sends a GET request to the board's endpoint and calculates the number of tasks.
 * If no tasks exist, it returns 0.
 *
 * @async
 * @function getBoardTasksCount
 * @param {string} boardname - The name or identifier of the board.
 * @returns {Promise<number>} A promise that resolves to the number of tasks for the board.
 */
async function getBoardTasksCount(boardname) {
    let response = await fetch(BOARD_URL + boardname + ".json");
    let responseToJson = await response.json();
    return responseToJson && responseToJson.tasks
        ? Object.keys(responseToJson.tasks).length
        : 0;
}

/**
 * Retrieves the details of a specific board.
 *
 * This function sends a GET request to the board's endpoint and returns the board data in JSON format.
 *
 * @async
 * @function getBoard
 * @param {string} boardname - The name or identifier of the board.
 * @returns {Promise<Object>} A promise that resolves to an object containing the board's details.
 */
async function getBoard(boardname) {
    let response = await fetch(BOARD_URL + boardname + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Adds a task to a specific board.
 *
 * This function sends a PUT request to the tasks sub-endpoint of a board to add a task.
 * The task is represented by its taskId. 
 *
 * @async
 * @function addTaskToBoard
 * @param {string} boardname - The name or identifier of the board.
 * @param {string} taskId - The identifier of the task to be added.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the PUT request.
 */
async function addTaskToBoard(boardname, taskId) {
    let response = await fetch(BOARD_URL + boardname + "/tasks/" + taskId + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(true)
    });
    return responseToJson = await response.json();
}

/**
 * Removes a task from a specific board.
 *
 * This function sends a DELETE request to the tasks sub-endpoint of a board to remove a task.
 *
 * @async
 * @function removeTaskFromBoard
 * @param {string} boardname - The name or identifier of the board.
 * @param {string} taskId - The identifier of the task to be removed.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the DELETE request.
 */
async function removeTaskFromBoard(boardname, taskId) {
    let response = await fetch(BOARD_URL + boardname + "/tasks/" + taskId + ".json", {
        method: "DELETE"
    });
    return responseToJson = await response.json();
}