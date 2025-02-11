function init() {
    includeHTML();
    fetchContacts();
    initializeAll();
}

function initializeAll() {
    initFormValidation();
    setupPrioritySystem();
    setupSelectArrows();
    initializeContactDropdown();
    loadContacts();
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

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const category = document.getElementById('category').value;

    const selectedPrioBtn = document.querySelector('.priority-btn.selected');
    const priority = selectedPrioBtn ? selectedPrioBtn.getAttribute('data-priority') : 'medium';

    const assignedTo = {};
    selectedContacts.forEach(id => {
        assignedTo[id] = true;
    });

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

    const [day, month, year] = dueDate.split('/');
    const formattedDate = `${year}-${month}-${day}`;

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
        await createTask(taskData);
        showNotification();
        resetForm();
        selectedContacts.clear();
        updateSelectedContactsDisplay();
        return false;
    } catch (error) {
        console.error('Error creating task:', error);
        return false;
    }
}

function showNotification() {
    const notification = document.getElementById('taskAddedNotification');
    notification.style.display = 'flex';

    setTimeout(() => {
        notification.style.display = 'none';
        window.location.href = 'board.html';
    }, 3000);
}

function resetForm() {
    const form = document.querySelector('.add-task-form');
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '';
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    });

    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.value = '';
        select.style.borderColor = '';
    });

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

    const subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInput) {
        subtaskInput.value = '';
    }

    // Clear selected contacts
    selectedContacts = [];
    updateSelectedDisplay();
    updateSelectedAvatars();

    // Clear the avatar display
    const avatarDiv = document.getElementById('selectedContactsAvatar');
    if (avatarDiv) {
        avatarDiv.innerHTML = '';
    }
}

let contacts = {}; // Store all contacts
let selectedContacts = []; // Store selected contact IDs

async function fetchContacts() {
    try {
        const response = await fetch('https://da-join-629d2-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        contacts = data || {}; // Ensure we have an object even if data is null
        renderContactsList();
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

function toggleContactDropdown() {
    const list = document.getElementById('contactList');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
}

function renderContactsList() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    // Convert contacts object to array and sort by name
    const sortedContacts = Object.entries(contacts)
        .filter(([_, contact]) => contact && contact.name)
        .sort((a, b) => a[1].name.localeCompare(b[1].name));

    sortedContacts.forEach(([id, contact]) => {
        const initials = getInitials(contact.name);
        const contactDiv = `
            <div class="contact-item" onclick="toggleContactSelection('${id}')">
                <div class="contact-info-container">
                    <div class="contact-avatar" style="background-color: ${contact.avatarColor || '#000000'}">
                        ${initials}
                    </div>
                    <div class="contact-name">${contact.name}</div>
                </div>
                <input type="checkbox" class="contact-checkbox" ${selectedContacts.includes(id) ? 'checked' : ''}>
            </div>
        `;
        contactList.innerHTML += contactDiv;
    });
}

function toggleContactSelection(contactId) {
    const index = selectedContacts.indexOf(contactId);
    if (index === -1) {
        selectedContacts.push(contactId);
    } else {
        selectedContacts.splice(index, 1);
    }

    renderContactsList();
    updateSelectedDisplay();
    updateSelectedAvatars(); // Add this line
}

function updateSelectedDisplay() {
    const searchInput = document.getElementById('contactSearch');
    // Always keep the placeholder text, regardless of selection
    searchInput.value = '';
    searchInput.placeholder = 'Select contacts to assign';
}

function updateSelectedAvatars() {
    const avatarDiv = document.getElementById('selectedContactsAvatar');
    if (!avatarDiv) return;

    avatarDiv.innerHTML = '';

    selectedContacts.forEach(contactId => {
        const contact = contacts[contactId];
        if (contact) {
            const initials = getInitials(contact.name);
            const avatarElement = document.createElement('div');
            avatarElement.className = 'contact-avatar-selected';
            avatarElement.style.backgroundColor = contact.avatarColor || '#000000';
            avatarElement.style.width = '32px';
            avatarElement.style.height = '32px';
            avatarElement.style.borderRadius = '50%';
            avatarElement.style.display = 'flex';
            avatarElement.style.alignItems = 'center';
            avatarElement.style.justifyContent = 'center';
            avatarElement.style.color = 'white';
            avatarElement.style.fontSize = '12px';
            avatarElement.style.fontWeight = '400';
            avatarElement.textContent = initials;
            avatarDiv.appendChild(avatarElement);
        }
    });
}

function getInitials(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
}
