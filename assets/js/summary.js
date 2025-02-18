/** Init function for the summary page */
function initSummary() {
  refreshGreeting();
  refreshBoardInfos();
}

async function refreshGreeting() {
  const username = await getUserName();
  refreshGreetingText(username);
  refreshGreetingName(username);
}

function refreshGreetingText(username) {
  const greetingTextRef = document.getElementById("summary-greeting-text");
  const greetingText2Ref = document.getElementById("summary-greeting-text2");
  const hours = new Date().getHours();

  if (hours < 11) {
    greetingTextRef.innerHTML = "Good morning";
    greetingText2Ref.innerHTML = "Good morning";
  } else if (hours < 17) {
    greetingTextRef.innerHTML = "Good afternoon";
    greetingText2Ref.innerHTML = "Good afternoon";
  } else {
    greetingTextRef.innerHTML = "Good evening";
    greetingText2Ref.innerHTML = "Good evening";
  }

  if (username !== null) {
    greetingTextRef.innerHTML += ",";
    greetingText2Ref.innerHTML += ",";
  }
}

function refreshGreetingName(username = "") {
  const greetingNameRef = document.getElementById("summary-greeting-name");
  const greetingName2Ref = document.getElementById("summary-greeting-name2");
  greetingNameRef.innerHTML = username;
  greetingName2Ref.innerHTML = username;
}

async function getUserName() {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    return null;
  }

  const user = await getUser(activeUser);
  if (!user) {
    return null;
  }

  return user.name;
}

async function refreshBoardInfos() {
  let boardCounts = await getBoardTasksCountList();
  let totalTasks = 0;
  for (const boardName of boardNames) {
    refreshTasksCount(boardCounts[boardName], "summary-taskscount-" + boardName);
    totalTasks += boardCounts[boardName];
  }
  refreshTasksCount(totalTasks, "summary-taskscount-board");

  await refreshTasksCount4Urgent();
  refreshUpcomingDeadline();
}

function refreshTasksCount(tasksCount, textId) {
  const textRef = document.getElementById(textId);
  textRef.innerHTML = tasksCount + "";
}

async function refreshTasksCount4Urgent() {
  let taskCount = await getTasksCount("urgent");
  const textRef = document.getElementById("summary-taskscount-urgent");
  textRef.innerHTML = taskCount + "";
}

async function refreshUpcomingDeadline() {
  const tasks = await getTasks();
  const board = await getBoard("done");
  let nextTaskDate = getNextUpcomingDate(tasks, board);

  const textRef = document.getElementById("summary-upcoming-deadline");
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  textRef.innerHTML = nextTaskDate.toLocaleDateString("en-US", options);
}