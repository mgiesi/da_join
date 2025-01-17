/** Init function for the summary page */
function initSummary() {
    refreshGreeting();
    refreshBoardInfos();
}

function refreshGreeting() {
    const username = getUserName();
    refreshGreetingText(username);
    refreshGreetingName(username);
}

function refreshGreetingText(username) {
    const greetingTextRef = document.getElementById("summary-greeting-text");
    const hours = new Date().getHours();

    if (hours < 11) {
        greetingTextRef.innerHTML = "Good morning"
    } else if (hours < 17) {
        greetingTextRef.innerHTML = "Good afternoon"
    } else {
        greetingTextRef.innerHTML = "Good evening"
    }

    if (username !== null) {
        greetingTextRef.innerHTML += ",";
    }
}

function refreshGreetingName(username = "") {
    const greetingNameRef = document.getElementById("summary-greeting-name");
    greetingNameRef.innerHTML = username;
}

function getUserName() {
    //todo read current logged in user from internal storage
    return "Markus Giesinger";
}

function refreshBoardInfos() {
    refreshTasksCount("todo", "summary-taskscount-todo");
    refreshTasksCount("done", "summary-taskscount-done");
    refreshTasksCount("inprogress", "summary-taskscount-inprogress");
    refreshTasksCount("awaitfeedback", "summary-taskscount-awaitingfeedback");
}

async function refreshTasksCount(board, textId) {
    const tasksCount = await getTasksCount(board);
    const textRef = document.getElementById(textId);
    textRef.innerHTML = tasksCount + "";
}