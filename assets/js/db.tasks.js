const TASKS_URL = DB_BASE_URL + "tasks/";

async function getTask(taskid) {
    let response = await fetch(TASKS_URL + taskid + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}