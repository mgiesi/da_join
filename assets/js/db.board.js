const BOARD_URL = DB_BASE_URL + "boards/";

async function getBoards() {
    let response = await fetch(BOARD_URL + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

async function getBoardTasksCount(boardname) {
    let response = await fetch(BOARD_URL + boardname + ".json");
    let responseToJson = await response.json();
    return responseToJson && responseToJson.tasks
        ? Object.keys(responseToJson.tasks).length
        : 0;
}

async function getBoard(boardname) {
    let response = await fetch(BOARD_URL + boardname + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

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

async function removeTaskFromBoard(boardname, taskId) {
    let response = await fetch(BOARD_URL + boardname + "/tasks/" + taskId + ".json", {
        method: "DELETE"
    });
    return responseToJson = await response.json();
}