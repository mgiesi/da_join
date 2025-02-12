function displayBoardContainer(board) {
  let addTaskContent = board.addtasks
    ? `<div onclick="toggleAddTaskOverlay()" class="board-container-titlebox-addtask d-flex justify-content-center align-items-center">+</div>`
    : "";
  return `
        <div class="board-container" ondrop="moveTaskTo('${board.id}')" ondragover="allowDrop(event)">
            <div class="board-container-titlebox d-flex justify-content-between">
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
            <div onclick="toggleTaskDetails()" class="board-task-container" draggable="true" ondragstart="startTaskDragging('${
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
                <span id="class="f11">${subTasksDone}/${subTasksCount} Subtasks</span>
            </div>
        `;
  }
}

function getSubTasksDoneCount(task, subTasksCount) {
  let subTasksDoneCount = 0;
  for (let subTaskIdx = 0; subTaskIdx < subTasksCount; subTaskIdx++) {
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

function getAddTaskOverlay() {
  return `
    <div class="overlay-addTask">
              
          <div w3-include-html=".\assets\templates\side-menu.html"></div>
  
          <main class="add-task-content">
              <div class="add-task-header">
                  <h1>Add Task</h1>
                  <div onclick="toggleAddTaskOverlay()" class="close-btn">×</div>
              </div>
  
              <form class="add-task-form">
                  <div class="form-columns">
                      <div class="form-left-column">
                          <div class="form-group">
                              <label for="title">Title<span class="required">*</span></label>
                              <input type="text" id="title" placeholder="Enter a title" required>
                          </div>
  
                          <div class="form-group">
                              <label for="description">Description</label>
                              <textarea id="description" placeholder="Enter a Description"></textarea>
                          </div>
  
                          <div class="form-group">
                              <label for="assigned">Assigned to</label>
                              <div class="select-wrapper">
                                  <select id="assigned">
                                      <option value="">Select contacts to assign</option>
                                  </select>
                              </div>
                          </div>
                      </div>
  
                      <div class="separator"></div>
  
                      <div class="form-right-column">
                          <div class="form-group">
                              <label for="dueDate">Due date<span class="required">*</span></label>
                              <div class="date-input-wrapper">
                                  <input type="text" id="dueDate" placeholder="dd/mm/yyyy" pattern="\d{2}/\d{2}/\d{4}"
                                      required maxlength="10" inputmode="numeric">
                                  <img src="./assets/icons/calendar.svg" alt="Calendar" class="calendar-icon">
                              </div>
                          </div>
                          <div class="form-group">
                              <label>Prio</label>
                              <div class="priority-buttons">
                                  <button type="button" class="priority-btn" data-priority="urgent"
                                      onclick="handlePriorityClick(this)">
                                      Urgent
                                      <img src="./assets/icons/prio-urgent.svg" alt="Urgent">
                                  </button>
                                  <button type="button" class="priority-btn" data-priority="medium"
                                      onclick="handlePriorityClick(this)">
                                      Medium
                                      <img src="./assets/icons/prio-medium.svg" alt="Medium">
                                  </button>
                                  <button type="button" class="priority-btn" data-priority="low"
                                      onclick="handlePriorityClick(this)">
                                      Low
                                      <img src="./assets/icons/prio-low.svg" alt="Low">
                                  </button>
                              </div>
                          </div>
  
                          <div class="form-group">
                              <label for="category">Category<span class="required">*</span></label>
                              <div class="select-wrapper">
                                  <select id="category" required>
                                      <option value="">Select task category</option>
                                      <option value="work">Technical Task</option>
                                      <option value="personal">User Story</option>
                                  </select>
                              </div>
                          </div>
  
                          <div class="form-group">
                              <label>Subtasks</label>
                          <div class="subtask-input">
                              <div class="input-wrapper">
                                  <input type="text" id="subtaskInput" placeholder="Add new subtask">
                                  <div class="subtask-actions">
                                  </div>
                              </div>
                          </div>
                              <div class="subtasks-list"></div>
                          </div>
                      </div>
                  </div>
                  <div class="footer-add-task-html">
                      <div class="required-note">
                          <span class="required">*</span><span class="span_txt">This field is required</span>
                      </div>
                      <div class="form-actions">
                          <button onclick="toggleAddTaskOverlay()" type="button" class="btn-secondary">
                              Clear
                              <img class="action-btn-img" src="./assets/icons/cancel.svg" alt="Clear form">
                          </button>
                          <button type="submit" class="btn-primary">
                              Create Task
                              <img src="./assets/icons/check.svg" alt="Create task">
                          </button>
                      </div>
                  </div>
              </form>
          </main>
      </div>
            </div>
          `;
}

function getTaskDetails() {
  return `
    <div class="topDetails">
            <div class="board-task-type task-type-userstory f3">User Story</div><div onclick="toggleTaskDetails()" class="close-btn">×</div></div>
            <div class="taskHeadline"><h1 class="f1">Kochwelt Page & Recipe Recommender</h1></div>
            <div class="description f2"><p>Build start page recipe recommendation.</p></div>
            <div class="dueDate"><p class="f2">Due Date: </p><p class="f2">10/05/2023</p></div>
            <div class="priority"><p class="f2">Priority: </p><p class="f2">Medium</p></div>
            <div class="assignedTo"><p class="topAssigned">Assigned To:</p><div class="assignedContacts"><div class="taskContactDetails">Emmanuel Mauer</div>
            <div class="taskContactDetails">Marcel Bauer</div>
            <div class="taskContactDetails">Anton Mayer</div></div></div>
            <div class="subTasks"><p class="topAssigned">Subtasks</p><div class="checkedSubTasks"><div class="oneSubTask">
                <input type="checkbox"><p class="f3">Implemented Recipe Recommendation</p></div><div class="oneSubTask">
                    <input type="checkbox"><p class="f3">Start Page Layout</p></div></div></div>
                    <div class="detailsButton"><button class="endBtn"><img class="detailsImgBtn" src="./assets/icons/delete.svg" alt="">Delete</button>
                        <button class="endBtn"><img class="detailsImgBtn" src="./assets/icons/edit.svg" alt="">Edit</button></div>
    `;
}
