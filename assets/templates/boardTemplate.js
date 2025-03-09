function displayBoardContainer(board) {
  let addTaskContent = board.addtasks
    ? `<div onclick="showAddTaskOverlay('${board.id}')" class="board-container-titlebox-addtask d-flex justify-content-center align-items-center">+</div>`
    : "";
  return `
        <div class="board-container" ondrop="moveTaskTo('${board.id}')" ondragover="allowDrop(event)">
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
  const taskCount = board && board.tasks ? Object.keys(board.tasks).length : 0;
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
            <div onclick="toggleTaskDetails('${board.id}', '${taskId}')" class="board-task-container" draggable="true" ondragstart="startTaskDragging('${
      board.id
    }', '${taskId}')">
                <div class="d-flex mb-24">
                    ${displayTaskType(task.category)}
                </div>
                <div class="mb-24">
                    <div class="mb-8">
                        <span class="f9">${task.title}</span>
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
            </div>
        `;
  });
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
            <div class="board-task-subtasks mb-24 d-flex align-items-center">
                <div class="board-subtasks-bar">
                    <div style="width: ${subTasksDonePercent}%" class="board-subtasks-bar-value"></div>
                </div>
                <span class="f11">${subTasksDone}/${subTasksCount} Subtasks</span>
            </div>
        `;
  }
}

function getSubTasksDoneCount(task, subTasksCount) {
  let subTasksDoneCount = 0;
  for (let subTaskIdx = 0; subTaskIdx < subTasksCount; subTaskIdx++) {
    if (!task.subtasks["subtask" + (subTaskIdx + 1)]) {
      continue;
    }
    if (task.subtasks["subtask" + (subTaskIdx + 1)].done) {
      subTasksDoneCount++;
    }
  }
  return subTasksDoneCount;
}

function displayAssignedTo(task, contacts) {
  const contactsCount =
    task && task.assignedTo ? Object.keys(task.assignedTo).length : 0;
  if (contactsCount <= 0) {
    return "";
  } else {
    let contactsContent = "";
    Object.keys(task.assignedTo).forEach((contactId) => {
      const contact = contacts[contactId];
      if (contact === undefined || contact === null) {
        return;
      } else {
        contactsContent += displayContact(contact);
      }
    });

    return contactsContent;
  }
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
