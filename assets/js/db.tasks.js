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
    const response = await fetch(TASKS_URL + ".json");
    const responseToJson = await response.json();

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

/**
 * Retrieves the next upcoming due date from a collection of tasks, excluding those marked as completed.
 *
 * This function iterates over each task in the `tasks` object, skipping tasks that are already present in the `done` board.
 * For each remaining task, it compares the task's due date to find the earliest one. The due date is expected to be stored
 * in a property called `dueDate` in each task object.
 *
 * @function getNextUpcomingDate
 * @param {Object} tasks - An object containing task objects keyed by task IDs. Each task object should have a `dueDate` property.
 * @param {Object} boardDone - An object with a `tasks` property (an object) that holds task IDs for tasks that have been completed.
 * @returns {Date|undefined} The earliest upcoming due date as a Date object, or `undefined` if no applicable due date is found.
 */
function getNextUpcomingDate(tasks, boardDone) {
    let nextTaskDate;
    Object.keys(tasks).forEach(taskId => {
        if (Object.keys(boardDone.tasks).includes(taskId)) {
            return;
        }

        let taskDate = new Date(tasks[taskId].dueDate);
        if (!nextTaskDate) {
            nextTaskDate = taskDate;
        } else {
            if (nextTaskDate.getTime() > taskDate.getTime()) {
                nextTaskDate = taskDate;
            }
        }
    });
    return nextTaskDate;
}

/**
 * Creates a new task in the database.
 *
 * @async
 * @function createTask
 * @param {Object} taskData - The task data to be saved
 * @param {string} taskData.title - The title of the task
 * @param {string} taskData.description - The description of the task
 * @param {string} taskData.assignedTo - The assigned person
 * @param {string} taskData.dueDate - The due date of the task
 * @param {string} taskData.prio - The priority of the task
 * @param {string} taskData.category - The category of the task
 * @param {Array} taskData.subtasks - Array of subtask objects
 * @returns {Promise<Object>} A promise that resolves to the created task data
 */
async function createTask(taskData) {
    try {
        const response = await fetch(TASKS_URL + ".json", {
            method: 'POST',
            body: JSON.stringify({
                title: taskData.title,
                description: taskData.description,
                assignedTo: taskData.assignedTo,
                dueDate: taskData.dueDate,
                prio: taskData.prio,
                category: taskData.category,
                subtasks: taskData.subtasks
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        const result = await response.json();

        // After creating the task, add it to the "todo" board
        await addTaskToBoard('todo', result.name); // result.name contains the Firebase key

        return result;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

/**
 * Adds a task to a specific board
 * @param {string} boardId - The ID of the board
 * @param {string} taskId - The ID of the task
 */
async function addTaskToBoard(boardId, taskId) {
    try {
        const response = await fetch(`${DB_BASE_URL}boards/${boardId}/tasks/${taskId}.json`, {
            method: 'PUT',
            body: JSON.stringify(true)
        });

        if (!response.ok) {
            throw new Error('Failed to add task to board');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding task to board:', error);
        throw error;
    }
}

/**
 * Toggles the "done" property of a specific subtask stored in Firebase.
 * The function retrieves the subtask, toggles its "done" value (if true, sets to false; if false, sets to true),
 * writes the updated subtask back to the database, and returns the updated object.
 *
 * @async
 * @param {string} taskId - The ID of the task.
 * @param {string} subtaskId - The ID of the subtask to be toggled.
 * @returns {Promise<Object>} A promise that resolves to the updated subtask object.
 */
async function toggleTaskDone(taskId, subtaskId) {
    let response = await fetch(TASKS_URL + taskId + "/subtasks/" + subtaskId + ".json");
    let subtask = await response.json();
  
    subtask.done = !subtask.done;
  
    await fetch(TASKS_URL + taskId + "/subtasks/" + subtaskId + ".json", {
      method: "PUT", // Alternatively, use "PATCH" to update only the "done" field
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(subtask)
    });

    renderTasks();
  }
  