/**
 * Base URL for tasks, composed of the database base URL and the "tasks/" path.
 * Ensure that DB_BASE_URL is available by including db.js.
 * @constant {string}
 */
const TASKS_URL = DB_BASE_URL + "tasks/";

/**
 * Retrieves tasks from the database, optionally filtering them based on the provided text.
 *
 * This function sends a GET request to the tasks endpoint and returns the tasks in JSON format.
 * If a filterText is provided and is not empty, the function filters the tasks by checking if the
 * lowercased filter text is included in the task's title or description.
 *
 * @async
 * @function getTasks
 * @param {string} [filterText] - Optional text to filter tasks by their title or description.
 * @returns {Promise<Object>} A promise that resolves to an object containing all tasks or only those
 * matching the filter criteria.
 */
async function getTasks(filterText) {
    let response = await fetch(TASKS_URL + ".json");
    let responseToJson = await response.json();

    if (!filterText || filterText.trim() === "") {
        return responseToJson;
    }

    const lowerCaseFilterText = filterText.toLowerCase();
    const filteredTasks = {};
    for (const [key, task] of Object.entries(responseToJson)) {
        const title = task.title ? task.title.toLowerCase() : "";
        const descr = task.description ? task.description.toLowerCase() : "";

        if (title.includes(lowerCaseFilterText) || descr.includes(lowerCaseFilterText)) {
            filteredTasks[key] = task;
        }
    }

    return filteredTasks;
}

/**
 * Retrieves a specific task by its ID.
 *
 * This function sends a GET request to the tasks endpoint for the specified task ID and returns
 * the task data in JSON format.
 *
 * @async
 * @function getTask
 * @param {string} taskid - The unique identifier of the task to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to an object containing the task details.
 */
async function getTask(taskid) {
    let response = await fetch(TASKS_URL + taskid + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Counts the number of tasks with a specific priority.
 *
 * This function sends a GET request to retrieve all tasks from the tasks endpoint, then iterates
 * through the tasks to count how many have a priority that matches the provided prio value.
 *
 * @async
 * @function getTasksCount
 * @param {string} prio - The priority value to filter tasks by.
 * @returns {Promise<number>} A promise that resolves to the count of tasks with the specified priority.
 */
async function getTasksCount(prio) {
    let response = await fetch(TASKS_URL + ".json");
    let responseToJson = await response.json();

    if (!responseToJson) {
        return 0;
    }

    let filteredTasksCount = 0;
    Object.keys(responseToJson).forEach(task => {
        if (responseToJson[task].prio === prio) {
            filteredTasksCount++;
        }
    });

    return filteredTasksCount;
}