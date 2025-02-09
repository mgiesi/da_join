function init() {
    includeHTML().then(() => {
        initializeAll();
    });
}

function initializeAll() {
    initFormValidation();
    setupPrioritySystem();
    setupSelectArrows();
}

function setupSelectArrows() {
    const selectWrappers = document.querySelectorAll('.select-wrapper');

    selectWrappers.forEach(wrapper => {
        const select = wrapper.querySelector('select');

        select.onfocus = function () {
            wrapper.classList.add('focused');
        };

        select.onblur = function () {
            wrapper.classList.remove('focused');
        };
    });
}

function setupPrioritySystem() {
    window.handlePriorityClick = function (buttonElement) {
        const buttons = document.querySelectorAll('.priority-btn');

        buttons.forEach(btn => {
            btn.classList.remove('active', 'selected');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        });

        buttonElement.classList.add('active', 'selected');
        const priority = buttonElement.getAttribute('data-priority');
    };
}

function initFormValidation() {
    const form = document.querySelector('.add-task-form');
    const requiredFields = form.querySelectorAll('[required]');

    form.setAttribute('novalidate', '');

    requiredFields.forEach(field => {
        if (!field.parentNode.querySelector('.error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required';
            field.parentNode.appendChild(errorMessage);
        }

        field.oninput = function () {
            if (field.value.trim()) {
                field.style.borderColor = '';
                const errorMessage = field.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            }
        };
    });

    // Connect the form submission to the handleFormSubmit function
    form.onsubmit = function (e) {
        e.preventDefault();
        validateAndSubmitForm(e);
    };
}

async function validateAndSubmitForm(event) {
    event.preventDefault();

    const form = event.target;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Validate all required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'red';
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
        }
    });

    if (!isValid) {
        return false;
    }

    // If validation passes, prepare the task data
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const assignedSelect = document.getElementById('assigned');
    const dueDate = document.getElementById('dueDate').value;
    const category = document.getElementById('category').value;

    const selectedPrioBtn = document.querySelector('.priority-btn.selected');
    const priority = selectedPrioBtn ? selectedPrioBtn.getAttribute('data-priority') : 'medium';

    // Transform assigned contacts into the required format
    const assignedTo = {};
    if (assignedSelect.value) {
        assignedTo[assignedSelect.value] = true;
    }

    // Get subtasks
    const subtasksContainer = document.querySelector('.subtasks-list');
    const subtasks = {};
    if (subtasksContainer) {
        const subtaskElements = subtasksContainer.querySelectorAll('.subtask-item');
        subtaskElements.forEach((element, index) => {
            const subtaskText = element.querySelector('.subtask-text').textContent;
            subtasks[`subtask${index + 1}`] = {
                name: subtaskText,
                done: false
            };
        });
    }

    // Transform date from dd/mm/yyyy to yyyy-mm-dd format
    const [day, month, year] = dueDate.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    // Create task data object
    const taskData = {
        title,
        description,
        assignedTo,
        dueDate: formattedDate,
        prio: priority,
        category: category === 'work' ? 'task' : 'userstory',
        subtasks
    };

    try {
        // Use the createTask function from db.tasks.js
        await createTask(taskData);

        // Show success notification
        showNotification();

        // Reset form
        resetForm();

        return false;
    } catch (error) {
        console.error('Error creating task:', error);
        return false;
    }
}

function showNotification() {
    const notification = document.getElementById('taskAddedNotification');
    notification.style.display = 'flex';

    // After 3 seconds, hide the notification and redirect
    setTimeout(() => {
        notification.style.display = 'none';
        window.location.href = 'board.html';
    }, 3000);
}

function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assigned').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('category').value = '';

    const priorityButtons = document.querySelectorAll('.priority-btn');
    priorityButtons.forEach(btn => {
        btn.classList.remove('active', 'selected');
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.borderColor = '';
    });

    const subtasksContainer = document.querySelector('.subtasks-list');
    if (subtasksContainer) {
        subtasksContainer.innerHTML = '';
    }
}

// Make sure handlePriorityClick is available globally
window.handlePriorityClick = function (button) {
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('active', 'selected');
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.borderColor = '';
    });

    button.classList.add('active', 'selected');
};
