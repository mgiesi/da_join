/** Defines the maximum showing contacts in the board-task-card */
const maxContactsOnCard = 6;

function displayBoardContainer(board) {
  let addTaskContent = board.addtasks
    ? `<div onclick="showAddTaskOverlay('${board.id}')" class="board-container-titlebox-addtask d-flex justify-content-center align-items-center">+</div>`
    : "";
  return `
        <div class="board-container" ondrop="moveTaskTo(event, '${board.id}')" ondragover="allowDrop(event)">
            <div class="board-container-titlebox d-flex justify-content-between align-items-center">
                <span class="board-container-titlebox-title f10">${board.name}</span>
                ${addTaskContent}
            </div>
            <div id="board-container-${board.id}" class="board-container-tasks">
                
            </div>
        </div>
    `;
}

function displayBoardTasks(board, tasks, contacts) {
  const taskKeys =
    board && board.tasks
      ? Object.keys(board.tasks).filter((key) => key !== "undefined")
      : [];
  const taskCount = taskKeys.length;
  // const taskCount = board && board.tasks ? Object.keys(board.tasks).length : 0;
  if (taskCount <= 0) {
    return displayEmptyBoard(board);
  } else {
    return displayTasks(board, tasks, contacts);
  }
}

function displayEmptyBoard(board) {
  return `
            <div class="board-tasks-notasks d-flex justify-content-center align-items-center f3">
                No tasks ${board.name}
            </div>
        `;
}

function displayTasks(board, tasks, contacts) {
  let htmlContent = "";

  Object.keys(board.tasks).forEach((taskId) => {
    const task = tasks[taskId];
    if (task === undefined || task === null) {
      return;
    }
    htmlContent += `
            <div onclick="showTaskDetails('${
              board.id
            }', '${taskId}')" class="board-task-container" draggable="true" ondragstart="startTaskDragging('${
      board.id
    }', '${taskId}')">
                <div class="d-flex justify-content-between mb-24">
                    ${displayTaskType(task.category)}
                    <img onclick="toggleMoveTaskOverlay(event, 'board-task-overlay-${taskId}')" class="board-task-movetask" src="./assets/icons/arrow_down.svg"/>
                </div>
                <div class="mb-24">
                    <div class="mb-8">
                        <span class="board-task-title f9">${task.title}</span>
                    </div>
                    <p class="board-task-descr f3">
                        ${task.description}
                    </p>
                </div>
                ${displaySubTasks(task)}
                <div class="board-task-footer d-flex justify-content-between">
                    <div class="board-task-contacts">
                        ${displayAssignedTo(task, contacts)}
                    </div>
                    <img class="board-task-category" src="./assets/icons/prio-${
                      task.prio
                    }.svg" alt="">
                </div>
                <div id="board-task-overlay-${taskId}" class="board-task-move-overlay d-flex dNone">
                    <div class="d-flex justify-content-between">
                      <div class="f9">Move task to...</div>
                      <img onclick="toggleMoveTaskOverlay(event, 'board-task-overlay-${taskId}')" class="board-task-movetask-2" src="./assets/icons/arrow_down.svg"/>
                    </div>
                    ${displayMoveToElements(board.id, taskId)}
                </div>
            </div>
        `;
  });
  return htmlContent;
}

function displayMoveToElements(boardId, taskId) {
  let htmlContent = "";
  for (let index = 0; index < boardNames.length; index++) {
    const boardName = boardNames[index];
    if (boardName === boardId) {
      continue;
    }
    htmlContent += `<p class="f10" onclick="startTaskDragging('${boardId}', '${taskId}'); moveTaskTo(event, '${boardName}')">- ${boardTexts[index]}</p>`;
  }
  return htmlContent;
}

function displayTaskType(taskCategory) {
  if ("userstory" === taskCategory) {
    return `<div class="board-task-type task-type-userstory f3">User Story</div>`;
  } else {
    return `<div class="board-task-type task-type-technicaltask f3">Technical Task</div>`;
  }
}

function displaySubTasks(task) {
  const subTasksCount =
    task && task.subtasks ? Object.keys(task.subtasks).length : 0;
  if (subTasksCount <= 0) {
    return "";
  } else {
    const subTasksDone = getSubTasksDoneCount(task, subTasksCount);
    const subTasksDonePercent = (subTasksDone / subTasksCount) * 100;
    return `
            <div class="board-task-subtasks mb-24 d-flex align-items-center tooltip">
                <div class="board-subtasks-bar">
                    <div style="width: ${subTasksDonePercent}%" class="board-subtasks-bar-value"></div>
                </div>
                <span class="f11">${subTasksDone}/${subTasksCount} Subtasks</span>
                <span class="tooltiptext">${subTasksDone} of ${subTasksCount} subtasks done</span>
            </div>
        `;
  }
}

function getSubTasksDoneCount(task, subTasksCount) {
  let subTasksDoneCount = 0;
  Object.keys(task.subtasks).forEach((subtaskId) => {
    const subtask = task.subtasks[subtaskId];
    if (subtask.done) {
      subTasksDoneCount++;
    }
  });
  return subTasksDoneCount;
}

function displayAssignedTo(task, contacts) {
  const contactsCount =
    task && task.assignedTo ? Object.keys(task.assignedTo).length : 0;
  if (contactsCount <= 0) {
    return "";
  } else {
    let contactsContent = "";
    let displayedContacts = 0;
    Object.keys(task.assignedTo).forEach((contactId) => {
      const contact = contacts[contactId];
      if (contact === undefined || contact === null) {
        return;
      } else {
        displayedContacts++;
        if (displayedContacts < maxContactsOnCard) {
          contactsContent += displayContact(contact);
        }
      }
    });
    contactsContent += displayContactCount(displayedContacts);

    return contactsContent;
  }
}

function displayContactCount(displayedContacts) {
  if (displayedContacts < maxContactsOnCard) {
    return "";
  }

  return `
        <div class="task-contact f11" style="background: ${getRandomColor()}">+${
    displayedContacts - maxContactsOnCard + 1
  }</div >
        `;
}

function displayContact(contact) {
  return `
        <div class="task-contact f11" style="background: ${
          contact.avatarColor
        }">${getShortcutName(contact)}</div >
        `;
}

document.addEventListener("DOMContentLoaded", function () {
  function checkScreenSize() {
    if (window.innerWidth >= 1081) {
      const ref = document.querySelector(".respX");
      if (ref) {
        ref.style.display = "none";
      }
    }
  }

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

function handleVisibility() {
  const elements = document.querySelectorAll(".board-task-movetask");
  elements.forEach((element) => {
    if (window.innerWidth < 1500) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
}
handleVisibility();
window.addEventListener("resize", handleVisibility);
