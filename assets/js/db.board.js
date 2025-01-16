const BOARD_URL = DB_BASE_URL + "boards/";

async function getTasksCount(boardname) {
    let response = await fetch(BOARD_URL + boardname + ".json");
    let responseToJson = await response.json();
    return responseToJson && responseToJson.tasks
        ? Object.keys(responseToJson.tasks).length
        : 0;
}