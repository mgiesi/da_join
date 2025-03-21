/**
 * Base URL for tasks, composed of the database base URL and the "tasks/" path.
 * @constant {string}
 */
const TASKS_URL = DB_BASE_URL + "tasks/";

/** Optional flag to add a task to different board. */
let addTaskToBoardName;

/**
 * Retrieves tasks from the database with optional filtering.
 * @async
 * @param {string} [filterText] - Optional text to filter tasks.
 * @returns {Promise<Object>} Tasks matching the criteria.
 */
async function getTasks(filterText) {
    const response = await fetch(TASKS_URL + ".json");
    const tasks = await response.json();
    return filterText ? filterTasksByText(tasks, filterText) : tasks;
}

/**
 * Filters tasks by matching text in title or description.
 * @param {Object} tasks - Tasks to filter.
 * @param {string} filterText - Text to match.
 * @returns {Object} Filtered tasks.
 */
function filterTasksByText(tasks, filterText) {
    const lowerCaseFilterText = filterText.toLowerCase().trim();
    if (lowerCaseFilterText === "") return tasks;

    const filteredTasks = {};
    for (const [key, task] of Object.entries(tasks)) {
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
 * @async
 * @param {string} taskid - Task identifier.
 * @returns {Promise<Object>} Task details.
 */
async function getTask(taskid) {
    let response = await fetch(TASKS_URL + taskid + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Counts tasks with a specific priority.
 * @async
 * @param {string} prio - Priority value.
 * @returns {Promise<number>} Count of matching tasks.
 */
async function getTasksCount(prio) {
    let response = await fetch(TASKS_URL + ".json");
    let tasks = await response.json();
    if (!tasks) return 0;

    return countTasksByPriority(tasks, prio);
}

/**
 * Counts tasks with a specific priority.
 * @param {Object} tasks - Tasks to count.
 * @param {string} prio - Priority to match.
 * @returns {number} Count of matching tasks.
 */
function countTasksByPriority(tasks, prio) {
    let count = 0;
    Object.keys(tasks).forEach(task => {
        if (tasks[task].prio === prio) count++;
    });
    return count;
}

/**
 * Gets the next upcoming due date from tasks.
 * @param {Object} tasks - Tasks to check.
 * @param {Object} boardDone - Done board with completed tasks.
 * @returns {Date|undefined} Earliest upcoming date.
 */
function getNextUpcomingDate(tasks, boardDone) {
    let nextTaskDate;
    Object.keys(tasks).forEach(taskId => {
        if (Object.keys(boardDone.tasks).includes(taskId)) return;

        let taskDate = new Date(tasks[taskId].dueDate);
        if (!nextTaskDate || nextTaskDate.getTime() > taskDate.getTime()) {
            nextTaskDate = taskDate;
        }
    });
    return nextTaskDate;
}

/**
 * Creates a new task in the database.
 * @async
 * @param {Object} taskData - Task data to save.
 * @returns {Promise<Object>} Created task data.
 */
async function createTask(taskData) {
    try {
        const result = await postTaskToDatabase(taskData);
        await addTaskToBoardAfterCreation(result.name);
        return result;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

/**
 * Posts task data to the database.
 * @async
 * @param {Object} taskData - Task data to post.
 * @returns {Promise<Object>} Response data.
 */
async function postTaskToDatabase(taskData) {
    const response = await fetch(TASKS_URL + ".json", {
        method: 'POST',
        body: JSON.stringify(taskData)
    });

    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
}

/**
 * Adds newly created task to appropriate board.
 * @async
 * @param {string} taskId - ID of created task.
 */
async function addTaskToBoardAfterCreation(taskId) {
    let boardName = addTaskToBoardName || 'todo';
    addTaskToBoardName = null;
    await addTaskToBoard(boardName, taskId);
}

/**
 * Updates an existing task in the database.
 * @async
 * @param {string} taskId - Task identifier.
 * @param {Object} taskData - Updated task data.
 * @returns {Promise<Object>} Updated task data.
 */
async function updateTask(taskId, taskData) {
    try {
        const response = await fetch(TASKS_URL + "/" + taskId + ".json", {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });

        if (!response.ok) throw new Error('Failed to update task');
        return await response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

/**
 * Adds a task to a specific board.
 * @async
 * @param {string} boardId - Board identifier.
 * @param {string} taskId - Task identifier.
 * @returns {Promise<Object>} Response data.
 */
async function addTaskToBoard(boardId, taskId) {
    try {
        const response = await fetch(`${DB_BASE_URL}boards/${boardId}/tasks/${taskId}.json`, {
            method: 'PUT',
            body: JSON.stringify(true)
        });

        if (!response.ok) throw new Error('Failed to add task to board');
        return await response.json();
    } catch (error) {
        console.error('Error adding task to board:', error);
        throw error;
    }
}

/**
 * Toggles a subtask's done status.
 * @async
 * @param {string} taskId - Task identifier.
 * @param {string} subtaskId - Subtask identifier.
 */
async function toggleTaskDone(taskId, subtaskId) {
    const subtask = await fetchSubtask(taskId, subtaskId);
    subtask.done = !subtask.done;
    await updateSubtask(taskId, subtaskId, subtask);
    renderTasks();
}

/**
 * Fetches a subtask from the database.
 * @async
 * @param {string} taskId - Task identifier.
 * @param {string} subtaskId - Subtask identifier.
 * @returns {Promise<Object>} Subtask data.
 */
async function fetchSubtask(taskId, subtaskId) {
    const response = await fetch(TASKS_URL + taskId + "/subtasks/" + subtaskId + ".json");
    return await response.json();
}

/**
 * Updates a subtask in the database.
 * @async
 * @param {string} taskId - Task identifier.
 * @param {string} subtaskId - Subtask identifier.
 * @param {Object} subtask - Updated subtask data.
 */
async function updateSubtask(taskId, subtaskId, subtask) {
    await fetch(TASKS_URL + taskId + "/subtasks/" + subtaskId + ".json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subtask)
    });
}

/**
 * Deletes a task from the database.
 * @async
 * @param {string} taskId - Task identifier.
 */
async function deleteTask(taskId) {
    await fetch(TASKS_URL + "/" + taskId + ".json", {
        method: "Delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify()
    });
}