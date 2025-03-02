/**
 * Initializes the summary page by refreshing the greeting and board information.
 */
function initSummary() {
  refreshGreeting();
  refreshBoardInfos();
}

/**
 * Refreshes the greeting message by retrieving the username and updating greeting text and name.
 * Also triggers the greeting animation for mobile view.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the greeting has been refreshed.
 */
async function refreshGreeting() {
  const username = await getUserName();
  refreshGreetingText(username);
  refreshGreetingName(username);
  setGreetingAnimation();
}

/**
 * Sets the greeting animation by hiding the greeting overlay if it has been shown before
 * or if the window width is equal to or greater than 1080 pixels.
 */
function setGreetingAnimation() {
  const greetingShown = localStorage.getItem("greetingShown");
  if (greetingShown || window.innerWidth >= 1080) {
    const greetingOverlayRef = document.getElementById("summary-greeting-overlay");
    greetingOverlayRef.style.display = "none";
  }
  localStorage.setItem("greetingShown", true);
}

/**
 * Updates the greeting text based on the current time of day.
 * If a username is provided, appends a comma after the greeting.
 *
 * @param {string|null} username - The user's name to be included in the greeting.
 */
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

/**
 * Updates the greeting name elements with the provided username.
 *
 * @param {string} [username=""] - The user's name to be displayed.
 */
function refreshGreetingName(username = "") {
  const greetingNameRef = document.getElementById("summary-greeting-name");
  const greetingName2Ref = document.getElementById("summary-greeting-name2");
  greetingNameRef.innerHTML = username;
  greetingName2Ref.innerHTML = username;
}

/**
 * Retrieves the active user's name from local storage.
 *
 * @async
 * @returns {Promise<string|null>} A promise that resolves to the user's name, or null if no active user is found.
 */
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

/**
 * Refreshes board-related information by updating the tasks count for each board,
 * the total tasks, urgent tasks count and the upcoming deadline.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when board information has been refreshed.
 */
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

/**
 * Updates the inner HTML of the specified element with the given tasks count.
 *
 * @param {number} tasksCount - The count of tasks to display.
 * @param {string} textId - The id of the HTML element where the count is displayed.
 */
function refreshTasksCount(tasksCount, textId) {
  const textRef = document.getElementById(textId);
  textRef.innerHTML = tasksCount + "";
}

/**
 * Retrieves and updates the count of urgent tasks.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the urgent tasks count has been refreshed.
 */
async function refreshTasksCount4Urgent() {
  let taskCount = await getTasksCount("urgent");
  const textRef = document.getElementById("summary-taskscount-urgent");
  textRef.innerHTML = taskCount + "";
}

/**
 * Refreshes the upcoming deadline displayed in the summary section.
 * Retrieves tasks and board data, determines the next upcoming deadline,
 * and updates the corresponding element with a formatted date string.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the upcoming deadline has been refreshed.
 */
async function refreshUpcomingDeadline() {
  const tasks = await getTasks();
  const board = await getBoard("done");
  let nextTaskDate = getNextUpcomingDate(tasks, board);

  const textRef = document.getElementById("summary-upcoming-deadline");
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  textRef.innerHTML = nextTaskDate.toLocaleDateString("en-US", options);
}