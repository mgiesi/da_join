const TASKS_URL = DB_BASE_URL + "tasks/";

async function getTasks() {
    let response = await fetch(TASKS_URL + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

async function getTask(taskid) {
    let response = await fetch(TASKS_URL + taskid + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

async function getTasksCount(prio) {
    let response = await fetch(TASKS_URL + ".json");
    let responseToJson = await response.json();

    if (responseToJson === undefined || response === null) {
        return 0;
    }

    let filteredTasksCount = 0;
    const tasksCount = Object.keys(responseToJson).length;
    for (let taskIdx = 0; taskIdx < tasksCount; taskIdx++) {
        if (responseToJson[taskIdx] === null) {
            continue;
        }
        if (responseToJson[taskIdx].prio === prio) {
            filteredTasksCount++;
        }

    }

    return filteredTasksCount;
}