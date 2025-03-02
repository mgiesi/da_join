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

function getEditTaskDetails(taskId, task, contacts) {
    return `
        <div class="overlay-editTaskDetails">
            <div class="dFlexWithEnd">
                <div onclick="toggleEditTaskDetails()" class="close-btn">×</div>
            </div>
            <div class="overlay-content-editTaskDetails">
                <div class="form-groupEdit">
                    <label for="title">Title<span class="required">*</span></label>
                    <input type="text" id="title" placeholder="Enter a title" value="${task.title}" required>
                </div>
        
                <div class="form-groupEdit">
                    <label for="description">Description</label>
                    <textarea id="description" placeholder="Enter a Description">${task.description}</textarea>
                </div>

                <div class="form-groupEdit">
                    <label for="dueDate">Due date<span class="required">*</span></label>
                    <div class="date-input-wrapper">
                        <input type="text" id="dueDate" placeholder="dd/mm/yyyy" pattern="\d{2}/\d{2}/\d{4}"
                            required maxlength="10" inputmode="numeric" value="${displayTaskDueDate(task.dueDate)}">
                        <img src="./assets/icons/calendar.svg" alt="Calendar" class="calendar-icon">
                    </div>
                </div>

                <div class="form-groupEdit">
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

                <div class="form-groupEdit">
                    <label for="assigned">Assigned to</label>
                    <div class="select-wrapper">
                        <select id="assigned">
                            <option value="">Select contacts to assign</option>
                        </select>
                    </div>
                </div>

                <div class="form-groupEdit">
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

            <button onclick="toggleEditTaskDetails()" class="checkBtn f6">Ok <img
                src="./assets/icons/check.svg" class="boardIconAdd" alt=""></button>
        </div>
    `;
}

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
                <button class="endBtn">
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
