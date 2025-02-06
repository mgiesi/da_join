const TASKS_URL = DB_BASE_URL + "tasks/";

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

async function getTask(taskid) {
    let response = await fetch(TASKS_URL + taskid + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

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