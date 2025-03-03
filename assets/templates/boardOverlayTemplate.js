function getTaskDetails(taskId, task, contacts) {
    if (!task) {
        return "";
    }
    return `
        <div class="overlay-taskDetails">
            <div class="topDetails">
                    ${displayTaskType(
                    task.category
                    )}<div onclick="toggleTaskDetails()" class="close-btn">×</div>
            </div>
            <div class="taskHeadline">
                <h1 class="f1">${task.title}</h1>
            </div>
            <div class="description f2">
                <p>${task.description}</p>
            </div>
            <div class="dueDate">
                <p class="f2">Due Date: </p>
                <p class="f2">${displayTaskDueDate(task.dueDate)}</p>
            </div>
            <div class="priority">
                <p class="f2">Priority: </p>
                <p class="f2">${
                task.prio.charAt(0).toUpperCase() + task.prio.slice(1)
                }</p>
                <img class="board-task-category" src="./assets/icons/prio-${
                task.prio
                }.svg" alt="">
            </div>
            <div class="assignedTo">
                <p class="topAssigned f2">Assigned To:</p>
                <div class="assignedContacts">
                    ${displayAssignedTo4TaskDetails(task, contacts)}
                </div>
            </div>
            ${displaySubTasks4TaskDetails(taskId, task)}
            <div class="detailsButton">
                <button onclick="doDeleteTask('${taskId}')" class="endBtn">
                    <img class="detailsImgBtn" src="./assets/icons/delete.svg" alt="">Delete
                </button>
                <button onclick="toggleTaskDetails(); toggleEditTaskDetails('${taskId}')" class="endBtn">
                    <img class="detailsImgBtn" src="./assets/icons/edit.svg" alt="">Edit
                </button>
            </div>
        </div>
    `;
}

function displayTaskDueDate(dueDate) {
  const date = new Date(dueDate);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  let formattedDate = date.toLocaleDateString("de-DE", options);
  formattedDate = formattedDate.replace(/\./g, "/");
  return formattedDate;
}

function displayAssignedTo4TaskDetails(task, contacts) {
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
        contactsContent += displayContact4TaskDetails(contact);
      }
    });

    return contactsContent;
  }
}

function displayContact4TaskDetails(contact) {
  return `
        <div class="d-flex align-items-center detailsAssignToBox">
            <div class="task-contact task-contact-details f11" style="background: ${
              contact.avatarColor
            }">${getShortcutName(contact)}</div >
            <p class="f2">${contact.name}</p>
        </div>
        `;
}

function displaySubTasks4TaskDetails(taskId, task) {
  const subTasksCount =
    task && task.subtasks ? Object.keys(task.subtasks).length : 0;
  if (subTasksCount <= 0) {
    return "";
  } else {
    let subtaskcontent = "";
    Object.keys(task.subtasks).forEach((subtaskId) => {
      const subtask = task.subtasks[subtaskId];
      if (!subtask) {
        return;
      } else {
        subtaskcontent += displaySubTask4TaskDetails(taskId, task, subtaskId, subtask);
      }
    });
    return `
            <div class="subTasks">
                <p class="topAssigned">Subtasks</p>
                <div class="checkedSubTasks">
                    ${subtaskcontent}
                </div>
            </div>
        `;
  }
}

function displaySubTask4TaskDetails(taskId, task, subtaskId, subtask) {
  return `
        <div class="oneSubTask">
            <input class="task-subtasks-checkbox" type="checkbox" onclick="toggleTaskDone('${taskId}', '${subtaskId}')" ${subtask.done ? "checked" : ""}>
            <p class="f3">${subtask.name}</p>
        </div>
    `;
}
