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
    greetingTextRef.innerHTML = "Good morning";
  } else if (hours < 17) {
    greetingTextRef.innerHTML = "Good afternoon";
  } else {
    greetingTextRef.innerHTML = "Good evening";
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
  return null;
}

function refreshBoardInfos() {
  for (const boardName of boardNames) {
    refreshTasksCount(boardName, "summary-taskscount-" + boardName);
  }
  refreshTasksCount4Urgent();
  refreshTasksInBoard();
}

async function refreshTasksCount(board, textId) {
  const tasksCount = await getBoardTasksCount(board);
  const textRef = document.getElementById(textId);
  textRef.innerHTML = tasksCount + "";
}

async function refreshTasksCount4Urgent() {
  let taskCount = await getTasksCount("urgent");
  const textRef = document.getElementById("summary-taskscount-urgent");
  textRef.innerHTML = taskCount + "";
}

async function refreshTasksInBoard() {
  let taskCount = 0;
  for (const boardName of boardNames) {
    taskCount += await getBoardTasksCount(boardName);
  }

  const textRef = document.getElementById("summary-taskscount-board");
  textRef.innerHTML = taskCount + "";
}